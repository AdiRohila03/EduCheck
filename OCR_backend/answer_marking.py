import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
import contractions
import ast

# Load SBERT model
sbert_model = SentenceTransformer('models/sbert_model')

class answer_marking:
    def __init__(self, student_answer, teacher_answer):
        self.student_answer = student_answer
        self.teacher_answer = teacher_answer

    def normalize(self, text):
        """Lowercase, expand contractions, remove punctuation."""
        text = contractions.fix(text.lower())
        text = re.sub(r'[^\w\s]', '', text)
        text = re.sub(r'\s+', ' ', text).strip()
        return text

    def is_fib_format(self):
        """Check if teacher answer is a dictionary (FIB format)."""
        return isinstance(self.teacher_answer, dict)

    def extract_student_fib_answers(self):
        """Extract student answers from string or list into a dictionary."""
        answers = {}
        key = None
        temp_word = ""

        # Convert string to list
        if isinstance(self.student_answer, str):
            try:
                self.student_answer = ast.literal_eval(self.student_answer)
            except Exception as e:
                print("Error parsing string to list:", e)
                return {}


        for item in self.student_answer:
            if item.endswith(")"):
                # Save previous key-value pair
                if key is not None:
                    answers[key] = temp_word.strip()
                key = item.strip(")")
                temp_word = ""  # Reset temp_word for the new key
            else:
                temp_word += item + " "

        # Save the last entry
        if key is not None and temp_word:
            answers[key] = temp_word.strip()

        # print(answers)
        
        return answers


    def grade_fib_dict(self):
        """Grade FIB answers where teacher answer is a dict."""
        stu_ans = self.extract_student_fib_answers()
        print(stu_ans)
        score = 0
        for key, correct_answer in self.teacher_answer.items():
            student_answer = stu_ans.get(key, "").lower().strip()
            if student_answer == correct_answer.lower().strip():
                score += 1
        
        return score

    def tfidf_score(self):
        t_ans = self.normalize(self.teacher_answer)
        s_ans = self.normalize(self.student_answer)
        vectorizer = TfidfVectorizer()
        tfidf_matrix = vectorizer.fit_transform([t_ans, s_ans])
        return round(cosine_similarity(tfidf_matrix[0], tfidf_matrix[1])[0][0], 2)

    def sbert_score(self):
        t_ans = self.normalize(self.teacher_answer)
        s_ans = self.normalize(self.student_answer)
        emb_t = sbert_model.encode(t_ans, convert_to_tensor=True)
        emb_s = sbert_model.encode(s_ans, convert_to_tensor=True)
        return round(cosine_similarity([emb_t.cpu().numpy()], [emb_s.cpu().numpy()])[0][0], 2)

    def grading(self):
        if self.is_fib_format():
            return self.grade_fib_dict()

        tfidf = self.tfidf_score()
        sbert = self.sbert_score()

        print("TF-IDF Score:", tfidf)
        print("SBERT Score:", sbert)

        # if abs(tfidf - sbert) > 0.4 and min(tfidf, sbert) < 0.6:
            # return "Please evaluate manually"

        return round((0.3*tfidf + 0.7*sbert), 2)