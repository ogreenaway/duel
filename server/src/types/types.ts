export type Task = {
    task_id: string | null,
    platform: "TikTok" | "Instagram" | "Facebook" | null,
    post_url: string | null,
    likes: number | null,
    comments: number | null,
    shares: number | null,
    reach: number | null
}

export type Program = {
    program_id: string | null,
    brand: string | null,
    total_sales_attributed: number | null,
    tasks_completed: Task[]
}

export type User = {
    user_id: string,
    name: string | null,
    email: string | null,
    instagram_handle: string | null,
    tiktok_handle: string | null,
    joined_at: string | null,
    advocacy_programs: Program[]
}