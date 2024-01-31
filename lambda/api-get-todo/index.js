const handler = async (event) => {
  console.log(JSON.stringify(event, null, 2));

  const data = [
    { id: 1, checked: false, todo: "Buy groceries for the week." },
    { id: 2, checked: false, todo: "Try a new recipe for dinner tonight." },
    { id: 3, checked: false, todo: "Clean the kitchen and do the dishes." },
  ];
  console.log("-----------------------> get to do 22", new Date());
  let response = {
    statusCode: 200,
    //   body: JSON.stringify(data),
    body: JSON.stringify({result: data}),
  };
  return response;
};

module.exports = { handler };
