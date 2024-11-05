from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import jwt
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
from bson import ObjectId
import random

app = FastAPI()

# CORS middleware configuration remains the same...

# Enhanced test generation with adaptive difficulty
async def get_adaptive_questions(user_id: str, config: TestConfig) -> List[Question]:
    # Get user's performance history
    user_history = await db.test_results.find({"user_id": user_id}).to_list(None)
    
    # Calculate topic-wise performance
    topic_performance = {}
    for result in user_history:
        for question in result["questions"]:
            topic = question["topic"]
            if topic not in topic_performance:
                topic_performance[topic] = {"correct": 0, "total": 0}
            topic_performance[topic]["total"] += 1
            if question["selected_answer"] == question["correct_answer"]:
                topic_performance[topic]["correct"] += 1

    # Adjust difficulty distribution based on performance
    questions = []
    for topic in config.topics:
        topic_score = 0.7  # Default medium difficulty
        if topic in topic_performance:
            correct = topic_performance[topic]["correct"]
            total = topic_performance[topic]["total"]
            topic_score = correct / total if total > 0 else 0.7

        # Determine difficulty distribution
        if topic_score < 0.4:  # Struggling
            difficulties = {"easy": 0.6, "medium": 0.3, "hard": 0.1}
        elif topic_score < 0.7:  # Intermediate
            difficulties = {"easy": 0.3, "medium": 0.4, "hard": 0.3}
        else:  # Advanced
            difficulties = {"easy": 0.1, "medium": 0.3, "hard": 0.6}

        # Calculate number of questions per difficulty
        topic_question_count = config.question_count // len(config.topics)
        for difficulty, ratio in difficulties.items():
            count = int(topic_question_count * ratio)
            if count > 0:
                pipeline = [
                    {
                        "$match": {
                            "topic": topic,
                            "difficulty": difficulty,
                            "type": {"$in": config.question_types}
                        }
                    },
                    {"$sample": {"size": count}}
                ]
                topic_questions = await db.questions.aggregate(pipeline).to_list(None)
                questions.extend(topic_questions)

    # Shuffle questions
    random.shuffle(questions)
    
    # Trim to exact count if needed
    return questions[:config.question_count]

@app.post("/generate-test")
async def generate_test(config: TestConfig, user_id: str):
    questions = await get_adaptive_questions(user_id, config)
    return [
        {
            "id": str(question["_id"]),
            **{k: v for k, v in question.items() if k != "_id"}
        }
        for question in questions
    ]

# Save test results with enhanced analytics
@app.post("/results")
async def save_test_results(results: TestResults):
    # Calculate additional metrics
    topic_performance = {}
    for question in results.questions:
        topic = question.topic
        if topic not in topic_performance:
            topic_performance[topic] = {"correct": 0, "total": 0}
        topic_performance[topic]["total"] += 1
        if question.selected_answer == question.correct_answer:
            topic_performance[topic]["correct"] += 1

    # Calculate improvement compared to previous tests
    previous_results = await db.test_results.find({
        "user_id": results.user_id,
        "subject": results.subject
    }).sort("timestamp", -1).limit(1).to_list(None)

    improvement = 0
    if previous_results:
        previous_score = previous_results[0]["score"]
        improvement = results.score - previous_score

    # Save enhanced results
    result_doc = {
        "user_id": results.user_id,
        "subject": results.subject,
        "questions": results.questions,
        "score": results.score,
        "time_taken": results.time_taken,
        "topic_performance": topic_performance,
        "improvement": improvement,
        "timestamp": datetime.utcnow()
    }

    await db.test_results.insert_one(result_doc)
    return {"id": str(result_doc["_id"])}