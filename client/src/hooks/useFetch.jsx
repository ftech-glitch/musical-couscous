const useFetch = () => {
  const fetchData = async (endpoint, method, body, token) => {
    const headers = {
      Authorization: "Bearer " + token, // Authorization header is common for both cases
    };

    // If body is of type FormData, don't set Content-Type, as browser does this automatically
    const options = {
      method,
      headers,
    };

    // If body is not FormData, set the Content-Type to JSON and stringify the body
    if (body && !(body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(body);
    } else if (body instanceof FormData) {
      options.body = body;
    }

    const res = await fetch(import.meta.env.VITE_SERVER + endpoint, options);
    const data = await res.json();

    let returnValue = {};
    if (res.ok) {
      if (data.status === "error") {
        returnValue = { ok: false, data: data.message };
      } else {
        returnValue = { ok: true, data };
      }
    } else {
      if (data?.errors && Array.isArray(data.errors)) {
        const messages = data.errors.map((item) => item.msg);
        returnValue = { ok: false, data: messages };
      } else if (data?.status === "error") {
        returnValue = { ok: false, data: data.message || data.msg };
      } else {
        console.log(data);
        returnValue = { ok: false, data: "An error has occurred" };
      }
    }

    return returnValue;
  };

  return fetchData;
};

export default useFetch;

// const useFetch = () => {
//   const fetchData = async (endpoint, method, body, token) => {
//     const res = await fetch(import.meta.env.VITE_SERVER + endpoint, {
//       method,
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: "Bearer " + token,
//       },
//       body: JSON.stringify(body),
//     });
//     const data = await res.json();

//     let returnValue = {};
//     if (res.ok) {
//       if (data.status === "error") {
//         returnValue = { ok: false, data: data.message };
//       } else {
//         returnValue = { ok: true, data };
//       }
//     } else {
//       if (data?.errors && Array.isArray(data.errors)) {
//         const messages = data.errors.map((item) => item.msg);
//         returnValue = { ok: false, data: messages };
//       } else if (data?.status === "error") {
//         returnValue = { ok: false, data: data.message || data.msg };
//       } else {
//         console.log(data);
//         returnValue = { ok: false, data: "An error has occurred" };
//       }
//     }

//     return returnValue;
//   };

//   return fetchData;
// };

// export default useFetch;
