import { groq } from 'next-sanity'

export const getAllProjectsQuery = groq`
  *[_type == "project"] | order(featured desc, year desc) {
    _id,
    title,
    slug,
    client,
    year,
    tags,
    description,
    featured,
    coverImage,
    coverVideo,
    coverVideoFile { asset-> { url } },
    coverAnimation {
      animationType,
      lottieFile { asset-> { url } },
      gifImage { ..., asset-> },
    },
    thumbnailSize,
  }
`

export const getProjectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    client,
    year,
    tags,
    description,
    featured,
    coverImage,
    coverVideo,
    contentBlocks[] {
      ...,
      _type == "imageBlock" => { ..., image { ..., asset-> } },
      _type == "galleryBlock" => { ..., images[] { ..., image { ..., asset-> } } },
      _type == "videoBlock" => { ..., file { asset-> } },
      _type == "animationBlock" => { ..., lottieFile { asset-> }, gifImage { ..., asset-> } },
    },
    seo {
      title,
      description,
      ogImage { ..., asset-> },
    },
    "nextProject": *[_type == "project" && slug.current != $slug] | order(featured desc, year desc)[0] {
      title,
      slug,
      coverImage,
    },
  }
`

export const getAllTeamMembersQuery = groq`
  *[_type == "teamMember"] | order(order asc) {
    _id,
    name,
    role,
    bio,
    photo,
  }
`
