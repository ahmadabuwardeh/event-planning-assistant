export async function GET(req:Request, res:Response) {
    console.log(req);
    return Response.json( "hello world")
}