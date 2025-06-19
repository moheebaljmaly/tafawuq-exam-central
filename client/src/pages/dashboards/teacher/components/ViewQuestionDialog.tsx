"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge";

const getDifficultyVariant = (difficulty) => {
    switch (difficulty) {
      case "easy": return "success";
      case "medium": return "warning";
      case "hard": return "destructive";
      default: return "outline";
    }
};

const getQuestionTypeText = (type) => {
    switch (type) {
        case "multiple_choice": return "اختيار من متعدد";
        case "essay": return "مقالي";
        case "short_answer": return "إجابة قصيرة";
        default: return type;
    }
}

export const ViewQuestionDialog = ({ open, onOpenChange, question }) => {
  if (!question) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>معاينة السؤال</DialogTitle>
          <DialogDescription>
            هذه هي تفاصيل السؤال كما سيظهر للطلاب.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <div className="flex justify-between items-center">
                <span className="font-semibold text-sm text-muted-foreground">المادة:</span>
                <Badge variant="outline">{question.subject || 'غير محدد'}</Badge>
            </div>
            <div className="flex justify-between items-center">
                <span className="font-semibold text-sm text-muted-foreground">نوع السؤال:</span>
                <Badge variant="secondary">{getQuestionTypeText(question.question_type)}</Badge>
            </div>
            <div className="flex justify-between items-center">
                <span className="font-semibold text-sm text-muted-foreground">مستوى الصعوبة:</span>
                <Badge variant={getDifficultyVariant(question.difficulty)}>{question.difficulty}</Badge>
            </div>

            <div className="space-y-2 pt-4">
                <h4 className="font-semibold">نص السؤال:</h4>
                <p className="p-4 bg-muted rounded-md text-muted-foreground">{question.question_text}</p>
            </div>

            {question.question_type === 'multiple_choice' && question.options && (
                 <div className="space-y-2 pt-4">
                    <h4 className="font-semibold">الخيارات:</h4>
                    <ul className="list-disc list-inside space-y-2">
                        {question.options.map((option, index) => (
                            <li key={index} className="p-2 bg-muted rounded-md text-muted-foreground">{option.text}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
        <DialogFooter>
          <Button type="button" onClick={() => onOpenChange(false)}>
            إغلاق
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 