"""
Resume parser - extracts skills, experience, education, projects from resume text.
Uses regex patterns; spaCy optional for enhanced extraction.
"""
import re


class ResumeParser:
    def __init__(self):
        pass

    def parse(self, resume_text: str) -> dict:
        """Parse resume text and extract structured data."""
        text = (resume_text or "").strip().lower()
        result = {
            "skills": [],
            "experience_years": 0.0,
            "project_count": 0,
            "internship_count": 0,
            "education_degree": "",
            "raw_text": resume_text[:500] if resume_text else ""
        }

        # Extract skills via common patterns
        skill_patterns = [
            r'\b(python|java|javascript|react|node\.?js|c\+\+|sql|mongodb|aws|docker|git|machine learning|ml|data science)\b',
            r'\b(html|css|typescript|angular|vue|express|django|flask|fastapi)\b',
            r'\b(communication|leadership|teamwork|problem solving|analytical)\b',
        ]
        seen = set()
        for pat in skill_patterns:
            for m in re.finditer(pat, text, re.I):
                s = m.group(1).strip()
                if s not in seen:
                    seen.add(s)
                    result["skills"].append(s)

        # Experience years - look for "X years", "X+ years", "X yoe"
        exp_match = re.search(r'(\d+(?:\.\d+)?)\s*[+]?\s*(?:years?|yrs?|yoe)', text, re.I)
        if exp_match:
            result["experience_years"] = float(exp_match.group(1))
        else:
            exp_match = re.search(r'experience[:\s]+(\d+)', text, re.I)
            if exp_match:
                result["experience_years"] = float(exp_match.group(1))

        # Project count
        proj_matches = re.findall(r'\b(?:project|developed|built)\b.*?(?:\d+|one|two|three)', text, re.I)
        result["project_count"] = min(len(proj_matches) + len(re.findall(r'project\s*[#:]?\s*\d+', text, re.I)), 10)

        # Internship count
        intern_matches = re.findall(r'\bintern(?:ship)?\b', text, re.I)
        result["internship_count"] = min(len(intern_matches), 5)

        # Education degree
        degree_patterns = [
            (r'phd|doctorate', 'phd'),
            (r'm\.?tech|mtech|m\.?s\.?|ms|masters?', 'masters'),
            (r'b\.?tech|btech|b\.?e\.?|be|bachelor|b\.?s\.?|bs', 'bachelor'),
            (r'bca', 'bca'),
            (r'mca', 'mca'),
        ]
        for pat, label in degree_patterns:
            if re.search(rf'\b{pat}\b', text):
                result["education_degree"] = label
                break

        return result
