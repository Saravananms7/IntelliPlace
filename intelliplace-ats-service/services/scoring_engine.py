"""
Scoring engine for resume evaluation.
Calculates normalized feature scores and weighted final score.
"""


class ScoringEngine:
    WEIGHTS = {
        "semantic_similarity": 0.25,
        "role_similarity": 0.20,
        "skill_match_ratio": 0.20,
        "experience_score": 0.15,
        "project_score": 0.10,
        "education_match_score": 0.10,
    }

    def calculate_skill_match(self, resume_skills: list, required_skills: list) -> float:
        """Skill match ratio (0-1)."""
        if not required_skills:
            return 0.8
        req = set(s.lower().strip() for s in required_skills if s)
        res = set(s.lower().strip() for s in resume_skills if s)
        if not req:
            return 0.8
        # Partial match (substring)
        matches = sum(1 for r in req if any(r in rs or rs in r for rs in res))
        return min(1.0, matches / len(req))

    def calculate_experience_score(
        self,
        experience_years: float,
        min_experience_years: float
    ) -> float:
        """Experience score (0-1)."""
        if min_experience_years <= 0:
            return 0.8 if experience_years > 0 else 0.5
        if experience_years >= min_experience_years:
            return 1.0
        return max(0, experience_years / min_experience_years)

    def calculate_project_score(
        self,
        project_count: int,
        internship_count: int
    ) -> float:
        """Project/internship score (0-1)."""
        total = (project_count or 0) + (internship_count or 0)
        if total >= 3:
            return 1.0
        if total >= 1:
            return 0.7
        return 0.4

    def calculate_education_match(
        self,
        resume_degree: str,
        required_degree=None
    ) -> float:
        """Education match score (0-1)."""
        if not required_degree:
            return 0.8 if resume_degree else 0.6
        res = (resume_degree or "").lower()
        req = (required_degree or "").lower()
        if req in res or res in req:
            return 1.0
        degree_order = ["bachelor", "btech", "b.e", "masters", "mtech", "m.s", "phd"]
        res_idx = next((i for i, d in enumerate(degree_order) if d in res), -1)
        req_idx = next((i for i, d in enumerate(degree_order) if d in req), -1)
        if res_idx >= 0 and req_idx >= 0:
            return 1.0 if res_idx >= req_idx else 0.5
        return 0.6

    def compute_final_score(self, feature_scores) -> float:
        """Weighted final score (0-1)."""
        total = 0.0
        for name, weight in self.WEIGHTS.items():
            val = getattr(feature_scores, name, 0)
            total += val * weight
        return max(0, min(1, total))
