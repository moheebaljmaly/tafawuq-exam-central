"use client"

import { useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Trash } from "lucide-react"

const questionSchema = z.object({
  question_text: z.string().min(10, { message: "نص السؤال يجب أن يكون 10 أحرف على الأقل." }),
  question_type: z.enum(["multiple_choice", "essay", "short_answer"]),
  subject: z.string().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  options: z.array(z.object({ text: z.string().min(1, { message: "الخيار لا يمكن أن يكون فارغًا." }) })).optional(),
  correct_answer: z.object({ answer: z.string() }).optional(),
})

export const EditQuestionDialog = ({ open, onOpenChange, onQuestionUpdated, question }) => {
  const form = useForm({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      question_text: "",
      question_type: "multiple_choice",
      difficulty: "medium",
      options: [{ text: "" }, { text: "" }],
      subject: "",
      correct_answer: { answer: "" }
    },
  })

  useEffect(() => {
    if (question) {
      form.reset({
        question_text: question.question_text || "",
        question_type: question.question_type || "multiple_choice",
        difficulty: question.difficulty || "medium",
        options: question.options || [{ text: "" }, { text: "" }],
        subject: question.subject || "",
        correct_answer: question.correct_answer || { answer: "" }
      });
    }
  }, [question, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "options",
  })

  const questionType = form.watch("question_type")

  const onSubmit = async (values) => {
    if (!question) return;

    const { data, error } = await supabase
      .from("questions")
      .update(values)
      .match({ id: question.id })
      .select()

    if (error) {
      toast.error("حدث خطأ أثناء تحديث السؤال: " + error.message)
    } else {
      toast.success("تم تحديث السؤال بنجاح!")
      onQuestionUpdated()
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>تعديل السؤال</DialogTitle>
          <DialogDescription>
            قم بتحديث تفاصيل السؤال. سيتم حفظ التغييرات في بنك الأسئلة.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="question_text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نص السؤال</FormLabel>
                  <FormControl>
                    <Textarea placeholder="مثال: ما هي عاصمة المملكة العربية السعودية؟" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="question_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نوع السؤال</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر نوع السؤال" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="multiple_choice">اختيار من متعدد</SelectItem>
                        <SelectItem value="essay">مقالي</SelectItem>
                        <SelectItem value="short_answer">إجابة قصيرة</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>مستوى الصعوبة</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر مستوى الصعوبة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="easy">سهل</SelectItem>
                        <SelectItem value="medium">متوسط</SelectItem>
                        <SelectItem value="hard">صعب</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {questionType === "multiple_choice" && (
              <div className="space-y-4 rounded-md border p-4">
                <FormLabel>الخيارات</FormLabel>
                {fields.map((field, index) => (
                   <FormField
                      key={field.id}
                      control={form.control}
                      name={`options.${index}.text`}
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-2">
                             <FormControl>
                               <Input {...field} placeholder={`خيار رقم ${index + 1}`} />
                             </FormControl>
                             <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                                <Trash className="h-4 w-4" />
                             </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => append({ text: "" })}>
                  إضافة خيار جديد
                </Button>
              </div>
            )}
            
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
                إلغاء
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "جاري الحفظ..." : "حفظ التعديلات"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 