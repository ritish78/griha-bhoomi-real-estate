// "use server";

// export async function getListOfProperties(pageNumber: number = 1) {
//   const response = await fetch(`http://localhost:5000/api/v1/property?page=${pageNumber}`, {
//     next: { revalidate: 600 } //Cache in seconds to revalidate
//   });

//   const data = await response.json();

//   return data;
// }

// export async function getPropertyBySlug(slug: string) {
//   const response = await fetch(`http://localhost:5000/api/v1/property/${slug}`, {
//     next: { revalidate: 600 } //Cache in seconds to revalidate
//   });

//   const data = await response.json();

//   return data;
// }
