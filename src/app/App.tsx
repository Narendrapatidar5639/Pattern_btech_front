import { RouterProvider } from "react-router-dom";
import { router } from "./routes"; // Jo routes file humne upar update ki

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;