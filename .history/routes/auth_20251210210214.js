const jwt = require("jsonwebtoken");
const Joi = require("joi");
const { validateBody } = require("../middleware/validate");
const { ApiError } = require("../middleware/errorHandler");
const { authenticate } = require("../middleware/auth");

const router = express.Router();



const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().min(2).required(),
  role: Joi.string().valid("admin", "user", "trainer").default("user"),
});


// Helper function to generate JWT
const generateJWT = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "2d" }
  );
};

// Helper function to create user response
const createUserResponse = (user, token) => ({
  token,
  user: {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,

  },
});


router.get("/", async (req, res, next) => {
  try {
    const {
      q = "",
      role,
      limit = "10",
      offset = "0",
      sort = "createdAt",
      order = "desc",
    } = req.query;

    const take = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const skip = Math.max(0, parseInt(offset, 10) || 0);
    const allowedSort = new Set([
      "createdAt",
      "name",
      "email",
      "role",
      "wallet",
    ]);
    const orderByField = allowedSort.has(String(sort))
      ? String(sort)
      : "createdAt";
    const orderByDirection =
      String(order).toLowerCase() === "asc" ? "asc" : "desc";

    const where = {
      AND: [
        q
          ? {
              OR: [
                { name: { contains: q, mode: "insensitive" } },
                { email: { contains: q, mode: "insensitive" } },
              ],
            }
          : {},
        role ? { role } : {},
      ],
    };

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          wallet: true,
        },
        orderBy: { [orderByField]: orderByDirection },
        take,
        skip,
      }),
    ]);

    res.json({ items: users, total, limit: take, offset: skip });
  } catch (err) {
    next(err);
  }
});

// Regular email/password signup
router.post("/signup", validateBody(signupSchema), async (req, res, next) => {
  console.log("signup///////////");
  try {
    const { email, password, name, role } = req.body;

    const emailLower = email.toLowerCase();
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new ApiError(400, "Email already in use");

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email: emailLower, password: hashed, name, role },
    });

    const token = generateJWT(user);
    res.status(201).json(createUserResponse(user, token));
  } catch (err) {
    next(err);
  }
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Regular email/password login
router.post("/login", validateBody(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const emailLower = email.toLowerCase();
    
    //Mahmoud@gmail.com
    // MAHMOUD@GMAIL.COM

    const user = await prisma.user.findUnique({ where: { email: emailLower } });
    if (!user) throw new ApiError(401, "Invalid credentials");

    // Check if user signed up with Google (no password)
    if (!user.password && user.googleId) {
      throw new ApiError(401, "Please sign in with Google");
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new ApiError(401, "Invalid credentials");

    const token = generateJWT(user);
    res.json(createUserResponse(user, token));
  } catch (err) {
    next(err);
  }
});