import { useForm, Controller } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from 'react-router-dom';
import { ArrowRight, PlusCircle } from 'lucide-react';

export const CreateExamForm = ({ form, onSubmit, availableQuestions, isEditing = false, onAddNewQuestion }) => {
    return (
        <div className="container mx-auto py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <div className="flex items-center gap-4">
                        <Link to="/teacher-dashboard/manage-exams">
                            <Button variant="outline" size="icon">
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-bold">{isEditing ? 'تعديل الامتحان' : 'إنشاء امتحان جديد'}</h1>
                    </div>
                    <p className="text-muted-foreground mt-2">
                        {isEditing ? 'قم بتحديث تفاصيل الامتحان والأسئلة المختارة.' : 'املأ النموذج لإنشاء امتحان جديد لطلابك.'}
                    </p>
                </div>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>تفاصيل الامتحان الأساسية</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>عنوان الامتحان</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="مثال: الامتحان النهائي لمادة الرياضيات" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="subject"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>المادة</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="مثال: الرياضيات" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>وصف الامتحان (اختياري)</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="اكتب تعليمات أو وصفًا موجزًا للامتحان هنا..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="start_time"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>وقت وتاريخ البدء</FormLabel>
                                                    <FormControl>
                                                        <Input type="datetime-local" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="end_time"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>وقت وتاريخ الانتهاء</FormLabel>
                                                    <FormControl>
                                                        <Input type="datetime-local" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>اختر أسئلة الامتحان</CardTitle>
                                            <CardDescription>اختر الأسئلة التي تريد إضافتها من بنك الأسئلة الخاص بك.</CardDescription>
                                        </div>
                                        <Button type="button" size="sm" onClick={onAddNewQuestion}>
                                            <PlusCircle className="h-4 w-4 ml-2" />
                                            إضافة سؤال
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <FormField
                                        control={form.control}
                                        name="questions"
                                        render={({ field }) => (
                                            <FormItem>
                                                <ScrollArea className="h-72 w-full rounded-md border p-4">
                                                    {availableQuestions.map((question) => (
                                                        <FormItem
                                                            key={question.id}
                                                            className="flex flex-row items-start space-x-3 space-x-reverse space-y-0 my-3"
                                                        >
                                                            <FormControl>
                                                                <Checkbox
                                                                    checked={field.value?.includes(question.id)}
                                                                    onCheckedChange={(checked) => {
                                                                        const currentValue = field.value || [];
                                                                        if (checked) {
                                                                            field.onChange([...currentValue, question.id]);
                                                                        } else {
                                                                            field.onChange(
                                                                                currentValue.filter(
                                                                                    (value) => value !== question.id
                                                                                )
                                                                            );
                                                                        }
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <FormLabel className="text-sm font-normal w-full">
                                                                {question.question_text}
                                                            </FormLabel>
                                                        </FormItem>
                                                    ))}
                                                </ScrollArea>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting 
                                ? (isEditing ? 'جاري حفظ التعديلات...' : 'جاري إنشاء الامتحان...')
                                : (isEditing ? 'حفظ التعديلات' : 'إنشاء الامتحان')}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
