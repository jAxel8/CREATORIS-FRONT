export interface Task {
    _id: string;
    task: string;
    date: Date;
    done?: boolean;
}


export interface Stats {
    totalTasks: string;
    pendingTasks: string;
    completedTasks: string;
}