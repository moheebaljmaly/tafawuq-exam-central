"use client"

import { useState, useEffect, useMemo } from 'react';
import { supabase } from "@/lib/supabase";
import { useAuth } from '@/hooks/useAuth';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner";
import { Skeleton } from '@/components/ui/skeleton';

export const SelectQuestionsDialog = ({ open, onOpenChange, onQuestionsSelected, initiallySelected = [] }) => {
    const { user } = useAuth();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedQuestions, setSelectedQuestions] = useState(initiallySelected);

    useEffect(() => {
        const fetchQuestions = async () => {
            if (!user) return;
            setLoading(true);
            const { data, error } = await supabase
                .from('questions')
                .select('id, question_text, question_type, subject, difficulty')
                .eq('teacher_id', user.id);

            if (error) {
                toast.error("فشل تحميل بنك الأسئلة: " + error.message);
            } else {
                setQuestions(data);
            }
            setLoading(false);
        };
        fetchQuestions();
    }, [user]);

    const handleSelect = (questionId) => {
        setSelectedQuestions(prev => {
            const isSelected = prev.some(q => q.id === questionId);
            if (isSelected) {
                return prev.filter(q => q.id !== questionId);
            } else {
                const question = questions.find(q => q.id === questionId);
                return [...prev, { id: question.id }];
            }
        });
    };
    
    const handleSelectAll = (checked) => {
        if(checked) {
            setSelectedQuestions(questions.map(q => ({ id: q.id })));
        } else {
            setSelectedQuestions([]);
        }
    };
    
    const handleConfirm = () => {
        onQuestionsSelected(selectedQuestions);
        onOpenChange(false);
    }
    
    const isAllSelected = useMemo(() => questions.length > 0 && selectedQuestions.length === questions.length, [questions, selectedQuestions]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                <DialogTitle>اختيار أسئلة من البنك</DialogTitle>
                <DialogDescription>
                    حدد الأسئلة التي ترغب في إضافتها إلى هذا الامتحان.
                </DialogDescription>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead padding="checkbox">
                                    <Checkbox
                                        checked={isAllSelected}
                                        onCheckedChange={handleSelectAll}
                                    />
                                </TableHead>
                                <TableHead>نص السؤال</TableHead>
                                <TableHead>النوع</TableHead>
                                <TableHead>المادة</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                questions.map((question) => (
                                    <TableRow key={question.id}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedQuestions.some(q => q.id === question.id)}
                                                onCheckedChange={() => handleSelect(question.id)}
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">{question.question_text}</TableCell>
                                        <TableCell>{question.question_type}</TableCell>
                                        <TableCell>{question.subject || "-"}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>إلغاء</Button>
                    <Button onClick={handleConfirm}>تأكيد الاختيار ({selectedQuestions.length})</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
} 