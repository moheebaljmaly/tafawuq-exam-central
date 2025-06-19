import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Download, Percent, Star, Users } from "lucide-react";
import { ResponsiveContainer, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

// Mock Data
const resultsData = {
    "EXM001": {
        title: "امتحان الجبر الخطي",
        stats: {
            averageScore: 82,
            passRate: 91,
            participantCount: 35,
            highestScore: 98,
        },
        scoreDistribution: [
            { name: '0-20', value: 0 },
            { name: '21-40', value: 2 },
            { name: '41-60', value: 5 },
            { name: '61-80', value: 12 },
            { name: '81-100', value: 16 },
        ],
        studentResults: [
            { id: "STU001", name: "أحمد المصري", score: 95, status: "ناجح" },
            { id: "STU002", name: "فاطمة الزهراء", score: 88, status: "ناجح" },
            { id: "STU003", name: "يوسف شاهين", score: 72, status: "ناجح" },
            { id: "STU005", name: "علي حسن", score: 45, status: "راسب" },
        ]
    }
}

const ResultsAnalysis = () => {
    const [selectedExam, setSelectedExam] = useState("EXM001");
    const data = resultsData[selectedExam];

    if (!data) return <div>اختر امتحانًا لعرض النتائج.</div>

    const statCards = [
        { title: "متوسط الدرجات", value: `${data.stats.averageScore}%`, icon: BarChart },
        { title: "نسبة النجاح", value: `${data.stats.passRate}%`, icon: Percent },
        { title: "عدد المشاركين", value: data.stats.participantCount, icon: Users },
        { title: "أعلى درجة", value: `${data.stats.highestScore}%`, icon: Star },
    ]

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>تحليل نتائج الامتحانات</CardTitle>
                        <p className="text-muted-foreground text-sm mt-1">اختر امتحانًا مكتملاً لعرض تحليلاته.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Select dir="rtl" value={selectedExam} onValueChange={setSelectedExam}>
                          <SelectTrigger className="w-[300px]">
                            <SelectValue placeholder="اختر امتحانًا..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="EXM001">امتحان الجبر الخطي</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="outline">
                            <Download className="ml-2 h-4 w-4" />
                            تصدير النتائج
                        </Button>
                    </div>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map(card => (
                    <Card key={card.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                            <card.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{card.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <Card>
                    <CardHeader>
                        <CardTitle>توزيع الدرجات</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={data.scoreDistribution}>
                                <XAxis dataKey="name" stroke="#888888" fontSize={12} />
                                <YAxis stroke="#888888" fontSize={12} />
                                <Tooltip />
                                <Bar dataKey="value" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                 </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>نتائج الطلاب</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>الطالب</TableHead>
                                    <TableHead>الدرجة</TableHead>

                                    <TableHead>الحالة</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.studentResults.map(s => (
                                    <TableRow key={s.id}>
                                        <TableCell className="font-medium">{s.name}</TableCell>
                                        <TableCell>{s.score}%</TableCell>
                                        <TableCell className={s.status === 'ناجح' ? 'text-green-600' : 'text-red-600'}>{s.status}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default ResultsAnalysis; 