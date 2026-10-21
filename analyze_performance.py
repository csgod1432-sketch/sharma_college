import sys
import json
import pandas as pd # For data analysis [cite: 104]

def predict_improvement(student_id):
    # Mock data: In production, fetch this from MongoDB 
    data = {
        "attendance": 85,
        "marks": [70, 75, 80],
        "participation": "High"
    }
    
    # Simple AI Logic: Predicting trend [cite: 71]
    average = sum(data["marks"]) / len(data["marks"])
    suggestion = "Excellent trend. Focus on advanced topics." if average > 75 else "Need to improve attendance."
    
    result = {
        "studentId": student_id,
        "averageMark": average,
        "prediction": "On track for Grade A",
        "suggestion": suggestion
    }
    print(json.dumps(result))

if __name__ == "__main__":
    predict_improvement(sys.argv[1])