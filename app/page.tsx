import React from "react";
import { Chatting } from "@/components/assistant";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
    const supabase = createServerComponentClient({ cookies });
    const { data } = await supabase.auth.getSession();

    console.log(data)

    // if (!data.session?.user) {
    //     redirect("/login");
    // }

    return (
        <div>
            <Chatting />
        </div>
    );
}
