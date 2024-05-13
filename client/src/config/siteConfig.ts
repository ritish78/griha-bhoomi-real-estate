const links = {
  github: "https://github.com/ritish78"
};

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "GrihaBhoomi",
  description: "An opensource real-estate website built using Nextjs 14",
  links,
  mainNav: [
    {
      title: "Rent",
      items: [
        {
          title: "Land",
          href: "/land",
          description: "View Land that are available for rent!",
          items: []
        },
        {
          title: "House",
          href: "/house",
          description: "View House that are available for rent!",
          items: []
        }
      ]
    },
    {
      title: "Buy",
      items: [
        {
          title: "Land",
          href: "/land",
          description: "View Land that are available for sale!",
          items: []
        },
        {
          title: "House",
          href: "/house",
          description: "View House that are available for Sale!",
          items: []
        }
      ]
    }
  ]
};
