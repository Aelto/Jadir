
export default function(con: any, req: string, variables: any): [any] | any | null {
  return new Promise((resolve, reject) => {
    con.query(req, variables, (err: any, results: any, fields: any) => {

      if (err) {
        throw err
      }

      else {
        resolve(results)
      }

    })
  })
}