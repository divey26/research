"""
CV extraction pipeline:
- Extract text from PDF via PyMuPDF (fitz).
- Clean/normalize whitespace.
- Run spaCy en_core_web_lg to pull entities.
- Regex for emails, phones, links (LinkedIn, GitHub, generic).
- Skill matching via predefined keyword list.
- Return structured JSON-friendly dict.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from typing import Dict, Iterable, List, Optional, Set

import fitz  # PyMuPDF
import spacy
from spacy.language import Language
from spacy.tokens import Doc

SKILL_KEYWORDS: Set[str] = {
    "python",
    "java",
    "javascript",
    "typescript",
    "react",
    "next.js",
    "node.js",
    "django",
    "flask",
    "fastapi",
    "pandas",
    "numpy",
    "scikit-learn",
    "tensorflow",
    "pytorch",
    "mlops",
    "aws",
    "gcp",
    "azure",
    "docker",
    "kubernetes",
    "sql",
    "postgres",
    "mysql",
    "mongodb",
    "graphql",
    "rest",
    "ci/cd",
}

IT_TITLES: List[str] = [
    "software engineer",
    "frontend developer",
    "backend developer",
    "full-stack developer",
    "mobile app developer",
    "android developer",
    "ios developer",
    "devops engineer",
    "cloud engineer",
    "data analyst",
    "data scientist",
    "machine learning engineer",
    "ml engineer",
    "ui/ux designer",
    "cybersecurity analyst",
    "network engineer",
    "system administrator",
    "systems administrator",
    "product manager",
    "business analyst",
    "qa engineer",
    "test automation engineer",
    "database administrator",
    "dba",
    "ai/ml research engineer",
    "it support",
    "help desk technician",
]


def load_model() -> Language:
    try:
        return spacy.load("en_core_web_lg")
    except OSError as exc:  # pragma: no cover - runtime guard
        raise SystemExit(
            "Model en_core_web_lg not found. Install with: python -m spacy download en_core_web_lg"
        ) from exc


def extract_pdf_text(path: Path) -> str:
    doc = fitz.open(path)  # type: ignore[arg-type]
    pages = [page.get_text("text") for page in doc]
    doc.close()
    return "\n".join(pages)


def clean_text(text: str) -> str:
    """
    Normalize whitespace but preserve line breaks to keep bullet/section structure.
    - Normalize CRLF to LF.
    - Collapse runs of spaces/tabs on a line.
    - Limit 3+ newlines down to 2 to avoid giant gaps, but keep blank lines that separate sections.
    """
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    text = re.sub(r"[ \t]+", " ", text)  # collapse spaces/tabs per line
    text = re.sub(r"\n{3,}", "\n\n", text)  # keep some separation
    return text.strip()


def extract_regex_fields(text: str) -> Dict[str, List[str]]:
    email_re = re.compile(r"[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}", re.I)
    phone_re = re.compile(r"\+?\d[\d\-\s()]{7,}\d")
    linkedin_re = re.compile(r"https?://(?:www\.)?linkedin\.com/[^\s)]+", re.I)
    github_re = re.compile(r"https?://(?:www\.)?github\.com/[^\s)]+", re.I)
    url_re = re.compile(r"https?://[^\s)]+", re.I)

    emails = list(dict.fromkeys(email_re.findall(text)))
    phones = list(dict.fromkeys(phone_re.findall(text)))
    linkedin = list(dict.fromkeys(linkedin_re.findall(text)))
    github = list(dict.fromkeys(github_re.findall(text)))
    urls = list(dict.fromkeys(url_re.findall(text)))

    links = list(dict.fromkeys(linkedin + github + urls))
    return {
        "emails": emails,
        "phones": phones,
        "links": links,
        "linkedin": linkedin,
        "github": github,
    }


def extract_skills(text: str) -> List[str]:
    lowered = text.lower()
    found = [skill for skill in SKILL_KEYWORDS if skill in lowered]
    return sorted(found)

def extract_title(lines: List[str]) -> Optional[str]:
    """
    Heuristic for job title focused on IT roles:
    - Look at the first ~15 non-empty lines for known titles from IT_TITLES.
    - If none found, fall back to role-like phrases containing common keywords.
    """
    max_scan = 15
    for line in lines[:max_scan]:
        low = line.lower()
        for title in IT_TITLES:
            if title in low:
                # Return canonical title casing
                return title.title()

    keywords = ["engineer", "developer", "architect", "manager", "lead", "specialist", "consultant", "scientist", "analyst", "designer", "cto", "founder", "intern"]
    for line in lines[:max_scan]:
        low = line.lower()
        if any(k in low for k in keywords) and 3 <= len(line.split()) <= 12:
            return line
    return None


def extract_entities(doc: Doc) -> Dict[str, List[str]]:
    persons = _uniq([ent.text for ent in doc.ents if ent.label_ == "PERSON"])
    orgs = _uniq([ent.text for ent in doc.ents if ent.label_ == "ORG"])
    dates = _uniq([ent.text for ent in doc.ents if ent.label_ == "DATE"])
    gpes = _uniq([ent.text for ent in doc.ents if ent.label_ == "GPE"])
    return {
        "persons": persons,
        "orgs": orgs,
        "dates": dates,
        "gpes": gpes,
    }


def _uniq(items: Iterable[str]) -> List[str]:
    seen: Set[str] = set()
    out: List[str] = []
    for item in items:
        key = item.strip()
        if not key or key in seen:
            continue
        seen.add(key)
        out.append(key)
    return out


def extract_education(doc: Doc) -> List[str]:
    keywords = ("university", "college", "institute", "school", "academy")
    edu_lines: Set[str] = set()
    for ent in doc.ents:
        if ent.label_ == "ORG" and any(k in ent.text.lower() for k in keywords):
            edu_lines.add(ent.text.strip())
    for sent in doc.sents:
        if any(k in sent.text.lower() for k in keywords):
            edu_lines.add(sent.text.strip())
    return sorted(edu_lines)


def extract_experience(doc: Doc) -> List[str]:
    """
    Heuristic: keep sentences or lines that look like bullets and mention ORG or verbs,
    even without explicit dates, to avoid losing projects/work blurbs.
    """
    experience: Set[str] = set()
    for sent in doc.sents:
        text = sent.text.strip()
        labels = {ent.label_ for ent in sent.ents}
        has_org = "ORG" in labels
        has_date = "DATE" in labels
        bulletish = text.startswith(("•", "-", "–", "—"))
        if has_org and (has_date or bulletish or len(text) > 40):
            experience.add(text)
    return sorted(experience)


def extract_cv(path: Path, nlp: Optional[Language] = None) -> Dict[str, object]:
    nlp = nlp or load_model()
    raw_text = extract_pdf_text(path)
    text = clean_text(raw_text)

    regex_fields = extract_regex_fields(text)
    doc = nlp(text)
    entities = extract_entities(doc)
    skills = extract_skills(text)
    education = extract_education(doc)
    experience = extract_experience(doc)
    lines = [ln.strip() for ln in text.split("\n") if ln.strip()]

    # Name heuristic: try the first non-empty line before "objective"/"summary", else first PERSON.
    name_from_header = None
    for ln in lines:
        low = ln.lower()
        if "objective" in low or "summary" in low:
            break
        if len(ln.split()) <= 6:
            name_from_header = ln
            break

    title = extract_title(lines)

    return {
        "name": name_from_header or (entities["persons"][0] if entities["persons"] else None),
        "email": regex_fields["emails"][0] if regex_fields["emails"] else None,
        "phone": regex_fields["phones"][0] if regex_fields["phones"] else None,
        "links": regex_fields["links"],
        "title": title,
        "skills": skills,
        "education": education,
        "experience": experience,
        "entities": entities,
        "raw_text": text,
    }


def main(args: List[str]) -> None:
    try:
        sys.stdout.reconfigure(encoding="utf-8")  # type: ignore[attr-defined]
    except Exception:
        pass
    # Ensure stdin uses utf-8 as well when driven by Next.js API
    try:
        sys.stdin.reconfigure(encoding="utf-8")  # type: ignore[attr-defined]
    except Exception:
        pass
    if len(args) < 2:
        sys.exit("Usage: python cv_extractor.py <path-to-pdf>")
    pdf_path = Path(args[1])
    if not pdf_path.exists():
        sys.exit(f"File not found: {pdf_path}")

    nlp = load_model()
    result = extract_cv(pdf_path, nlp)
    print(json.dumps(result, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main(sys.argv)
