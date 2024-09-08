import React from "react";
import { createClient } from "@/app/utils/supabase/server";

export default async function TodoList() {
	const supabase = createClient();
	const { data: todos } = await supabase.from("user_table").select("*");

	return <pre>{JSON.stringify(todos, null, 2)}</pre>;
}
