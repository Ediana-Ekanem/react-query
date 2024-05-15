import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"; //Fetching Data (get request)

function App() {
  const queryClient = useQueryClient();

  // useInfiniteQuery === get data as you're scrolling down your page

  const { data, isLoading, error } = useQuery({
    queryKey: ["post"],
    queryFn: () =>
      fetch("https://jsonplaceholder.typicode.com/posts").then((response) =>
        response.json()
      ),

    // gcTime: 6000, // cachTime or garbage collection time (gcTime) => set it in main
    // staleTime: 3000,
    refetchInterval: 3000,
    // refetchOnWindowFocus
    // refetchInterval: 3000,
    // retry: 5, ==> retry this time before accept failure
    /* 
    ___StaleTime___
    if there is no chnage in the query within 3secs it will refetch authomatically
    __Condition___ for requesting again
    1. When a new instance of the query is mounted
    2. When the window is refocused (eg switching taps)
    3. When network is reconnected
    4. When the query is optionally configured such that it has a refetch interval

    */
  });

  // Palarrel queries

  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: (newPost) =>
      fetch("https://jsonplaceholder.typicode.com/posts", {
        headers: { "Content-type": "application/json; charset=UTF-8" },
        method: "POST",
        body: JSON.stringify(newPost),
      }).then((response) => response.json()),
    // inalidating query
    onSuccess: (newPost) => {
      // queryClient.invalidateQueries({ queryKey: ["post"] }); // refetch data
      queryClient.setQueryData(["post"], (oldPosts) => [...oldPosts, newPost]);
    },
  });

  if (error || isError) return <div>There was an Error !</div>;
  // if () return <div>Error: {error.message}</div>;

  return (
    <div>
      {isPending && <p>Data is Beight Added...</p>}
      <button
        onClick={() =>
          mutate({
            userId: 6000,
            id: 7000,
            title: "Hey, this is Edy!",
            body: "And i am trying out Tansack React Query (useQuery and useMutation)",
          })
        }
      >
        Add Post
      </button>
      {data &&
        data.map((todo) => (
          <div key={todo.id}>
            <h1>ID: {todo.id}</h1>
            <h3>Title: {todo.title}</h3>
            <p>{todo.body}</p>
          </div>
        ))}
    </div>
  );
}

export default App;
