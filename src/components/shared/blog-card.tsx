import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { BlogPost } from "@/types/content";

type BlogCardProps = {
  post: BlogPost;
};

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Card className="h-full overflow-hidden border-slate-800 bg-slate-900/40 backdrop-blur">
      <div className="relative aspect-[16/9] overflow-hidden border-b border-slate-800">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          className="object-cover opacity-85"
          sizes="(min-width: 1024px) 33vw, 100vw"
        />
      </div>
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {post.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="outline" className="border-cyan-500/40 text-cyan-200">
              {tag}
            </Badge>
          ))}
        </div>
        <CardTitle className="text-xl text-white">{post.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed text-slate-300">{post.excerpt}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between text-xs text-slate-400">
        <span>{post.readTime}</span>
        <Link href={`/blog/${post.slug}`} className="font-semibold text-cyan-300 hover:text-cyan-200">
          Read article
        </Link>
      </CardFooter>
    </Card>
  );
}
