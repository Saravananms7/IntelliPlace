"""
Semantic Matching Service using Sentence-BERT
Computes cosine similarity between resume and job description
"""

from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class SemanticMatcher:
    def __init__(self):
        """
        Initialize Sentence-BERT model.
        Model: all-mpnet-base-v2 (768-dimensional embeddings)
        """
        try:
            self.model = SentenceTransformer('all-mpnet-base-v2')
            self.embedding_dim = 768
        except Exception as e:
            raise Exception(
                f"Failed to load Sentence-BERT model: {str(e)}\n"
                "Install with: pip install sentence-transformers"
            )
    
    def compute_similarity(self, resume_text: str, job_description: str, job_description_pdf_text: str = None) -> float:
        """
        Compute semantic similarity between resume and job description.
        If PDF text is provided, combines both text and PDF for comprehensive matching.
        
        Args:
            resume_text: Full text content of the resume
            job_description: Complete job description text
            job_description_pdf_text: Optional text extracted from job description PDF
        
        Returns:
            Cosine similarity score between 0 and 1
        """
        try:
            # Generate resume embedding
            resume_embedding = self.model.encode(
                resume_text,
                convert_to_numpy=True,
                show_progress_bar=False
            )
            
            # Combine job description text and PDF text if available
            combined_job_text = job_description
            if job_description_pdf_text and job_description_pdf_text.strip():
                # Combine both texts, giving more weight to PDF if it exists
                # PDF often contains more detailed requirements
                combined_job_text = f"{job_description}\n\n{job_description_pdf_text}"
            
            # Generate job description embedding
            job_embedding = self.model.encode(
                combined_job_text,
                convert_to_numpy=True,
                show_progress_bar=False
            )
            
            # Reshape for sklearn cosine_similarity (expects 2D array)
            resume_embedding = resume_embedding.reshape(1, -1)
            job_embedding = job_embedding.reshape(1, -1)
            
            # Compute cosine similarity
            similarity = cosine_similarity(resume_embedding, job_embedding)[0][0]
            
            # Ensure value is between 0 and 1 (cosine similarity can be -1 to 1)
            # Normalize to 0-1 range
            similarity = (similarity + 1) / 2
            
            return float(similarity)
            
        except Exception as e:
            raise Exception(f"Error computing semantic similarity: {str(e)}")
    
    def compute_role_similarity(self, resume_text: str, job_title: str) -> float:
        """
        Compute semantic similarity between resume and job title/role.
        This helps identify if the candidate's experience aligns with the specific role.
        
        Args:
            resume_text: Full text content of the resume
            job_title: Job title/role (e.g., "Software Engineer", "Data Scientist")
        
        Returns:
            Cosine similarity score between 0 and 1
        """
        try:
            # Generate embeddings for resume and job title
            resume_embedding = self.model.encode(
                resume_text,
                convert_to_numpy=True,
                show_progress_bar=False
            )
            
            job_title_embedding = self.model.encode(
                job_title,
                convert_to_numpy=True,
                show_progress_bar=False
            )
            
            # Reshape for sklearn cosine_similarity
            resume_embedding = resume_embedding.reshape(1, -1)
            job_title_embedding = job_title_embedding.reshape(1, -1)
            
            # Compute cosine similarity
            similarity = cosine_similarity(resume_embedding, job_title_embedding)[0][0]
            
            # Normalize to 0-1 range
            similarity = (similarity + 1) / 2
            
            return float(similarity)
            
        except Exception as e:
            raise Exception(f"Error computing role similarity: {str(e)}")




