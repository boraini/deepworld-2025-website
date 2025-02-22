type ImportedImage = any;
type ImportedMarkdown = any;

export interface Author {
    nickname: string,
    fullname: string,
    thumbnail?: ImportedImage,
    socials: Record<string, string>,
}

export interface Summary {
    slug: string,
    title: string,
    excerpt: string,
    tags: string[],
    thumbnail?: ImportedImage,
}

export interface Article {
    metadata: Summary,
    Component?: ImportedMarkdown,
}

export interface Directory {
    metadata: Summary,
    subdirectories: Directory[],
    articles: Summary[],
}
