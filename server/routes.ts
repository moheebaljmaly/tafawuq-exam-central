import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { registerExamRoutes } from "./routes/exams";

export async function registerRoutes(app: Express): Promise<Server> {
  // Register exam routes
  registerExamRoutes(app);
  
  // Authentication routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { email, password, fullName, role } = req.body;
      
      // Create profile directly (in real app, you'd integrate with auth provider)
      const profile = await storage.createProfile({
        id: `user_${Date.now()}`, // In real app, this would come from auth provider
        fullName,
        role: role || 'student'
      });
      
      res.json({ success: true, profile });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/auth/signin", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Create demo profile based on email
      const role = email.includes('teacher') ? 'teacher' : email.includes('admin') ? 'admin' : 'student';
      const profile = {
        id: `user_${Date.now()}`,
        fullName: email.split('@')[0],
        role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      res.json({ success: true, profile });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Profile routes
  app.get("/api/profiles/:id", async (req, res) => {
    try {
      const profile = await storage.getProfileById(req.params.id);
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/profiles/:id", async (req, res) => {
    try {
      const profile = await storage.updateProfile(req.params.id, req.body);
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Exam routes
  app.post("/api/exams", async (req, res) => {
    try {
      const exam = await storage.createExam(req.body);
      res.json(exam);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/exams/teacher/:teacherId", async (req, res) => {
    try {
      const exams = await storage.getExamsByTeacher(req.params.teacherId);
      res.json(exams);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/exams/active", async (req, res) => {
    try {
      const exams = await storage.getActiveExams();
      res.json(exams);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/exams/:id", async (req, res) => {
    try {
      const exam = await storage.getExamById(req.params.id);
      if (!exam) {
        return res.status(404).json({ error: "Exam not found" });
      }
      res.json(exam);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/exams/:id", async (req, res) => {
    try {
      const exam = await storage.updateExam(req.params.id, req.body);
      res.json(exam);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Question routes
  app.post("/api/questions", async (req, res) => {
    try {
      const question = await storage.createQuestion(req.body);
      res.json(question);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/questions/exam/:examId", async (req, res) => {
    try {
      const questions = await storage.getQuestionsByExam(req.params.examId);
      res.json(questions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Answer choice routes
  app.post("/api/answer-choices", async (req, res) => {
    try {
      const choice = await storage.createAnswerChoice(req.body);
      res.json(choice);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/answer-choices/question/:questionId", async (req, res) => {
    try {
      const choices = await storage.getAnswerChoicesByQuestion(req.params.questionId);
      res.json(choices);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Exam attempt routes
  app.post("/api/exam-attempts", async (req, res) => {
    try {
      const attempt = await storage.createExamAttempt(req.body);
      res.json(attempt);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/exam-attempts/student/:studentId", async (req, res) => {
    try {
      const attempts = await storage.getExamAttemptsByStudent(req.params.studentId);
      res.json(attempts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/exam-attempts/:id", async (req, res) => {
    try {
      const attempt = await storage.updateExamAttempt(req.params.id, req.body);
      res.json(attempt);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Student answer routes
  app.post("/api/student-answers", async (req, res) => {
    try {
      const answer = await storage.saveStudentAnswer(req.body);
      res.json(answer);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // RPC routes for legacy Supabase compatibility
  app.post("/api/rpc/:functionName", async (req, res) => {
    try {
      const { functionName } = req.params;
      const params = req.body;

      switch (functionName) {
        case 'get_total_users_count':
          res.json(150); // Mock user count
          break;
        case 'get_pending_teachers':
          res.json([]); // Mock empty pending teachers
          break;
        case 'approve_teacher':
          res.json({ success: true });
          break;
        case 'update_user_role':
          res.json({ success: true });
          break;
        case 'delete_user_by_admin':
          res.json({ success: true });
          break;
        case 'get_all_users_with_details':
          res.json([]); // Mock empty users list
          break;
        default:
          res.status(404).json({ error: 'Function not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
