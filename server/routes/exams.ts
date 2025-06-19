import type { Express } from "express";
import { storage } from "../storage";

export function registerExamRoutes(app: Express) {
  // Get active exams
  app.get("/api/exams/active", async (req, res) => {
    try {
      const exams = await storage.getActiveExams();
      res.json(exams);
    } catch (error) {
      console.error("Error fetching active exams:", error);
      res.status(500).json({ error: "فشل في جلب الامتحانات النشطة" });
    }
  });

  // Get exam by ID
  app.get("/api/exams/:id", async (req, res) => {
    try {
      const exam = await storage.getExamById(req.params.id);
      if (!exam) {
        return res.status(404).json({ error: "الامتحان غير موجود" });
      }
      res.json(exam);
    } catch (error) {
      console.error("Error fetching exam:", error);
      res.status(500).json({ error: "فشل في جلب بيانات الامتحان" });
    }
  });

  // Get exam by code
  app.get("/api/exams/code/:code", async (req, res) => {
    try {
      const exam = await storage.getExamByCode(req.params.code);
      if (!exam) {
        return res.status(404).json({ error: "رمز الامتحان غير صحيح" });
      }
      res.json(exam);
    } catch (error) {
      console.error("Error fetching exam by code:", error);
      res.status(500).json({ error: "فشل في البحث عن الامتحان" });
    }
  });

  // Get exam questions
  app.get("/api/exams/:id/questions", async (req, res) => {
    try {
      const questions = await storage.getQuestionsByExam(req.params.id);
      res.json(questions);
    } catch (error) {
      console.error("Error fetching exam questions:", error);
      res.status(500).json({ error: "فشل في جلب أسئلة الامتحان" });
    }
  });

  // Create exam
  app.post("/api/exams", async (req, res) => {
    try {
      const examData = req.body;
      console.log('Creating exam with data:', examData);
      
      // Create exam with proper structure
      const examToCreate = {
        id: `exam_${Date.now()}`,
        title: examData.title,
        description: examData.description,
        duration_minutes: examData.duration,
        teacher_id: examData.teacherId,
        is_active: examData.isActive || true,
        code: examData.code,
        start_time: examData.startDate && examData.startTime ? 
          new Date(`${examData.startDate}T${examData.startTime}`) : null,
        end_time: examData.endDate && examData.endTime ? 
          new Date(`${examData.endDate}T${examData.endTime}`) : null
      };
      
      const exam = await storage.createExam(examToCreate);
      
      // Create questions if provided
      if (examData.questions && examData.questions.length > 0) {
        for (const question of examData.questions) {
          const createdQuestion = await storage.createQuestion({
            exam_id: exam.id,
            question_text: question.text,
            question_type: question.type,
            order_number: examData.questions.indexOf(question) + 1
          });
          
          // Create answer choices for multiple choice questions
          if (question.type === 'multiple_choice' && question.choices) {
            for (const choice of question.choices) {
              await storage.createAnswerChoice({
                questionId: createdQuestion.id,
                choiceText: choice.text,
                isCorrect: choice.isCorrect,
                orderNumber: question.choices.indexOf(choice) + 1
              });
            }
          }
        }
      }
      
      res.json(exam);
    } catch (error) {
      console.error("Error creating exam:", error);
      res.status(500).json({ error: "فشل في إنشاء الامتحان" });
    }
  });

  // Join exam
  app.post("/api/exams/:id/join", async (req, res) => {
    try {
      const examId = req.params.id;
      const studentId = req.body.studentId || "demo_student";
      
      const attempt = await storage.createExamAttempt({
        studentId,
        examId
      });
      
      res.json({ success: true, attemptId: attempt.id });
    } catch (error) {
      console.error("Error joining exam:", error);
      res.status(500).json({ error: "فشل في الانضمام للامتحان" });
    }
  });

  // Get exams by teacher
  app.get("/api/teacher/:teacherId/exams", async (req, res) => {
    try {
      const exams = await storage.getExamsByTeacher(req.params.teacherId);
      res.json(exams);
    } catch (error) {
      console.error("Error fetching teacher exams:", error);
      res.status(500).json({ error: "فشل في جلب امتحانات المعلم" });
    }
  });

  // Create question
  app.post("/api/questions", async (req, res) => {
    try {
      const question = await storage.createQuestion(req.body);
      res.json(question);
    } catch (error) {
      console.error("Error creating question:", error);
      res.status(500).json({ error: "فشل في إنشاء السؤال" });
    }
  });

  // Create answer choice
  app.post("/api/answer-choices", async (req, res) => {
    try {
      const choice = await storage.createAnswerChoice(req.body);
      res.json(choice);
    } catch (error) {
      console.error("Error creating answer choice:", error);
      res.status(500).json({ error: "فشل في إنشاء خيار الإجابة" });
    }
  });

  // Submit exam answer
  app.post("/api/answers", async (req, res) => {
    try {
      const answer = await storage.saveStudentAnswer(req.body);
      res.json(answer);
    } catch (error) {
      console.error("Error saving answer:", error);
      res.status(500).json({ error: "فشل في حفظ الإجابة" });
    }
  });
}