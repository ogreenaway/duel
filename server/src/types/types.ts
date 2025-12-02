export type Platform = "TikTok" | "Instagram" | "Facebook"

export type Task = {
    _id: string,
    legacy_task_id: string,
    user_id: string,
    platform_id: string,
    platform: Platform | null,
    post_url: string | null,
    likes: number | null,
    comments: number | null,
    shares: number | null,
    reach: number | null
}

export type Program = {
    _id: string,
    user_id: string,
    legacy_program_id: string,
    brand: string | null,
    total_sales_attributed: number | null,
    tasks_completed: Task[]
}

export type User = {
    legacy_user_id: unknown,
    _id: string,
    name: string | null,
    email: string | null,
    instagram_handle: string | null,
    tiktok_handle: string | null,
    joined_at: string | null,
    advocacy_programs: Program[]
}