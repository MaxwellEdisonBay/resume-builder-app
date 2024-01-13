// import { NextRequest } from "next/server";

// // Creates a new section
// export async function PUT(
//     request: NextRequest,
//   ) {
//     // if (!mongoose.Types.ObjectId.isValid(templateId)) {
//     //   const errorResponse: BaseErrorResponse = {
//     //     message: `${templateId} is not a valid templateId!`,
//     //   };
//     //   return new NextResponse(JSON.stringify(errorResponse), {
//     //     status: 400,
//     //   });
//     // }
//     try {
//     //   const newTemplate: TemplateServer = await request.json();
//       // console.log(session?.user);
//       console.log({ newTemplate: newTemplate });
//       const result = await Template.create(newTemplate);
//       console.log({ result });
//       if (result) {
//         return new NextResponse(JSON.stringify(result), {
//           status: 201,
//         });
//       } else {
//         const errorResponse: BaseErrorResponse = {
//           message: "Could not create a new database template entry.",
//         };
//         return new NextResponse(JSON.stringify(errorResponse), {
//           status: 500,
//         });
//       }
//     } catch (e: unknown) {
//       let errorMessage = "Unknown error occurred.";
//       if (e instanceof Error) {
//         errorMessage = e.message;
//       }
//       const errorResponse: BaseErrorResponse = {
//         message: errorMessage,
//       };
//       return new NextResponse(JSON.stringify(errorResponse), {
//         status: 500,
//       });
//     }
//   }