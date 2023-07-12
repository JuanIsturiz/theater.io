// // Partial of ./pages/api/webhooks/index.ts
import Cors from "micro-cors";

const cors = Cors({
  allowMethods: ["POST", "HEAD"],
});

export default cors(() => null);
