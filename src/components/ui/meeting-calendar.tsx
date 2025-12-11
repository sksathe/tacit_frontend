"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Meeting } from "@/types";
import { Badge } from "@/components/ui/badge";

interface MeetingCalendarProps {
    meetings: Meeting[];
    onMeetingClick?: (meeting: Meeting) => void;
}

export function MeetingCalendar({ meetings, onMeetingClick }: MeetingCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay();

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const getMeetingsForDate = (date: Date): Meeting[] => {
        const dateStr = date.toISOString().split('T')[0];
        return meetings.filter(meeting => {
            const meetingDate = new Date(meeting.scheduledAt).toISOString().split('T')[0];
            return meetingDate === dateStr;
        });
    };

    const goToPreviousMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const isToday = (day: number) => {
        const today = new Date();
        return (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        );
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Scheduled':
                return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'In Progress':
                return 'bg-primary/20 text-primary border-primary/30';
            case 'Completed':
                return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'Cancelled':
                return 'bg-red-500/20 text-red-400 border-red-500/30';
            default:
                return 'bg-white/5 text-muted-foreground border-white/10';
        }
    };

    return (
        <Card className="bg-[#1a1a1f] border-white/10 rounded-xl overflow-hidden">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                            <CalendarIcon className="h-5 w-5 text-white/80" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl text-white">
                                {monthNames[month]} {year}
                            </CardTitle>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={goToPreviousMonth}
                            className="h-8 w-8 p-0 bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={goToToday}
                            className="h-8 px-3 bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
                        >
                            Today
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={goToNextMonth}
                            className="h-8 w-8 p-0 bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {dayNames.map((day) => (
                        <div
                            key={day}
                            className="text-center text-sm font-semibold text-white/50 py-2"
                        >
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                        <div key={`empty-${index}`} className="aspect-square" />
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, index) => {
                        const day = index + 1;
                        const date = new Date(year, month, day);
                        const dayMeetings = getMeetingsForDate(date);
                        const today = isToday(day);

                        return (
                            <div
                                key={day}
                                className={cn(
                                    "aspect-square border border-white/10 rounded-lg p-1.5 overflow-hidden hover:border-emerald-500/50 transition-colors bg-white/5",
                                    today && "border-emerald-500/50 bg-emerald-500/10"
                                )}
                            >
                                <div
                                    className={cn(
                                        "text-sm font-medium mb-1",
                                        today ? "text-emerald-400" : "text-white"
                                    )}
                                >
                                    {day}
                                </div>
                                <div className="space-y-0.5 overflow-y-auto max-h-[calc(100%-1.5rem)]">
                                    {dayMeetings.slice(0, 3).map((meeting) => {
                                        const statusColors: Record<string, string> = {
                                            'Scheduled': 'bg-blue-500 text-white border-blue-500',
                                            'In Progress': 'bg-emerald-500 text-white border-emerald-500',
                                            'Completed': 'bg-emerald-500 text-white border-emerald-500',
                                            'Cancelled': 'bg-white/10 text-white/60 border-white/20',
                                        };
                                        return (
                                            <div
                                                key={meeting.id}
                                                onClick={() => onMeetingClick?.(meeting)}
                                                className={cn(
                                                    "text-[10px] px-1.5 py-0.5 rounded border cursor-pointer hover:opacity-80 transition-opacity truncate",
                                                    statusColors[meeting.status] || 'bg-white/5 text-white/60 border-white/20'
                                                )}
                                                title={meeting.title}
                                            >
                                                {meeting.title}
                                            </div>
                                        );
                                    })}
                                    {dayMeetings.length > 3 && (
                                        <div className="text-[10px] text-white/40 px-1.5">
                                            +{dayMeetings.length - 3} more
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="mt-6 pt-6 border-t border-white/10">
                    <div className="flex flex-wrap gap-4 text-xs">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                            <span className="text-white/60">Scheduled</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-emerald-500" />
                            <span className="text-white/60">Active</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-emerald-500" />
                            <span className="text-white/60">Completed</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-white/30" />
                            <span className="text-white/60">Pending</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

