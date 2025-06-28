import { relations, sql } from "drizzle-orm";
import {
  index,
  pgEnum,
  pgTableCreator,
  primaryKey,
  unique,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `sinew_${name}`);

// =========== Enums ========== //
export const userRole = pgEnum("userRole", ["USER", "MENTOR", "ADMIN"]);
export const purchaseStatus = pgEnum("purchaseStatus", [
  "PURCHASED",
  "PENDING",
  "FREE",
]);
export const courseLevel = pgEnum("courseLevel", [
  "BEGINNER",
  "INTERMEDIATE",
  "EXPERT",
]);
export const requestStatus = pgEnum("requestStatus", [
  "PENDING",
  "ACCEPTED",
  "DENIED",
]);

export const users = createTable("user", (d) => ({
  id: d
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: d.varchar({ length: 255 }),
  email: d.varchar({ length: 255 }).notNull(),
  emailVerified: d
    .timestamp({
      mode: "date",
      withTimezone: true,
    })
    .default(sql`CURRENT_TIMESTAMP`),
  image: d.varchar({ length: 255 }),
  role: userRole("role").default("USER").notNull(),
  phone: d.varchar({ length: 255 }),
  password: d.varchar({ length: 255 }),
  notifConsent: d.boolean().default(false),
}));

export const usersRelations = relations(users, ({ many, one }) => ({
  mentorData: one(mentor),
  accounts: many(accounts),
  purchases: many(purchase),
}));

export const accounts = createTable(
  "account",
  (d) => ({
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    type: d.varchar({ length: 255 }).$type<AdapterAccount["type"]>().notNull(),
    provider: d.varchar({ length: 255 }).notNull(),
    providerAccountId: d.varchar({ length: 255 }).notNull(),
    refresh_token: d.text(),
    access_token: d.text(),
    expires_at: d.integer(),
    token_type: d.varchar({ length: 255 }),
    scope: d.varchar({ length: 255 }),
    id_token: d.text(),
    session_state: d.varchar({ length: 255 }),
  }),
  (t) => [
    primaryKey({ columns: [t.provider, t.providerAccountId] }),
    index("account_user_id_idx").on(t.userId),
  ],
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  (d) => ({
    sessionToken: d.varchar({ length: 255 }).notNull().primaryKey(),
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  }),
  (t) => [index("t_user_id_idx").on(t.userId)],
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  (d) => ({
    identifier: d.varchar({ length: 255 }).notNull(),
    token: d.varchar({ length: 255 }).notNull(),
    expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  }),
  (t) => [primaryKey({ columns: [t.identifier, t.token] })],
);

/**
 * ======================== Course data ===========================
 *
 * Storing bootcamp data including :
 *  - category
 *  - bootcamp/webinar
 *  - code promo
 */
export const category = createTable("category", (d) => ({
  id: d
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: d.varchar({ length: 255 }),
}));

export const categoryRelations = relations(category, ({ many }) => ({
  courses: many(course),
  mentorings: many(mentoring),
}));

export const course = createTable("course", (d) => ({
  id: d
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: d.varchar({ length: 255 }).notNull(),
  price: d.numeric({ precision: 15, scale: 0 }),
  image: d.varchar({ length: 255 }),
  bannerImage: d.varchar({ length: 255 }),
  desc: d.text(),
  titleDesc: d.varchar(),
  materi: d.text(),
  date: d.timestamp({ mode: "date", withTimezone: true }),
  level: courseLevel().default("BEGINNER"),
  place: d.varchar({ length: 255 }),
  placeUrl: d.varchar({ length: 255 }),
  isFree: d.boolean().default(false),
  isSale: d.boolean().default(false),
  salePrice: d.numeric({ precision: 15, scale: 0 }),
  isWebinar: d.boolean().default(false),
  isFeatured: d.boolean().default(false),
  isHidden: d.boolean().default(true),
  requireProofment: d.boolean().default(false),
  categoryId: d
    .varchar()
    .references(() => category.id, { onDelete: "set null" }),
  createdAt: d
    .timestamp({ mode: "date", withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: d
    .timestamp({ mode: "date", withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
}));

export const courseRelations = relations(course, ({ many, one }) => ({
  purchases: many(purchase),
  mentors: many(coursesToMentors),
  chapters: many(chapter),
  category: one(category, {
    fields: [course.categoryId],
    references: [category.id],
  }),
}));

export const coursesToMentors = createTable(
  "coursesToMentors",
  (d) => ({
    courseId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => course.id, { onDelete: "cascade" }),
    mentorId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => mentor.id, { onDelete: "cascade" }),
  }),
  (t) => [primaryKey({ columns: [t.courseId, t.mentorId] })],
);

export const coursesToMentorsRelations = relations(
  coursesToMentors,
  ({ one }) => ({
    course: one(course, {
      fields: [coursesToMentors.courseId],
      references: [course.id],
    }),
    mentor: one(mentor, {
      fields: [coursesToMentors.mentorId],
      references: [mentor.id],
    }),
  }),
);

export const chapter = createTable("chapter", (d) => ({
  id: d
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: d.varchar({ length: 256 }).notNull(),
  description: d.text(),
  videoUrl: d.text(),
  position: d.integer().notNull().default(0),
  isPublished: d.boolean().notNull().default(false),
  courseId: d
    .varchar({ length: 255 })
    .notNull()
    .references(() => course.id, { onDelete: "cascade" }),
  createdAt: d
    .timestamp({ mode: "date", withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: d
    .timestamp({ mode: "date", withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
}));

export const chapterRelations = relations(chapter, ({ one }) => ({
  muxData: one(muxData),
  course: one(course, {
    fields: [chapter.courseId],
    references: [course.id],
  }),
}));

export const muxData = createTable("muxData", (d) => ({
  id: d
    .varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  assetId: d.text("assetId").notNull(),
  playbackId: d.text("playbackId"),
  chapterId: d
    .varchar("chapterId")
    .notNull()
    .references(() => chapter.id, { onDelete: "cascade" }),
}));

export const muxDataRelations = relations(muxData, ({ one }) => ({
  chapter: one(chapter, {
    fields: [muxData.chapterId],
    references: [chapter.id],
  }),
}));

/**
 * ======================== Mentors data ===========================
 *
 * Storing mentor data including :
 *  - mentor
 *  - mentoring user data
 *  - mentoring mentor data
 *  - career guidance
 */
export const mentor = createTable("mentor", (d) => ({
  id: d
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: d
    .varchar({ length: 255 })
    .references(() => users.id, { onDelete: "cascade" }),
  name: d.varchar({ length: 255 }).notNull(),
  title: d.varchar({ length: 255 }).notNull(),
  company: d.varchar({ length: 255 }),
  industry: d.varchar({ length: 255 }),
  expertise: d.text().notNull(),
  image: d.varchar({ length: 255 }),
  desc: d.text().notNull(),
  linkedin: d.varchar({ length: 255 }),
  github: d.varchar({ length: 255 }),
  createdAt: d
    .timestamp({ mode: "date", withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: d
    .timestamp({ mode: "date", withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
}));

export const mentorRelations = relations(mentor, ({ one, many }) => ({
  mentoring: one(mentoring),
  courses: many(coursesToMentors),
  user: one(users, {
    fields: [mentor.userId],
    references: [users.id],
  }),
}));

export const mentoring = createTable("mentoring", (d) => ({
  id: d
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: d.varchar({ length: 255 }).notNull(),
  desc: d.text().notNull(),
  materi: d.text().notNull(),
  bannerImage: d.varchar({ length: 255 }),
  price: d.numeric({ precision: 15, scale: 0 }).notNull(),
  isFeatured: d.boolean().default(false),
  isHidden: d.boolean().default(true),
  status: requestStatus("status").default("PENDING"),
  mentorId: d
    .varchar({ length: 255 })
    .notNull()
    .references(() => mentor.id, { onDelete: "cascade" }),
  categoryId: d
    .varchar({ length: 255 })
    .references(() => category.id, { onDelete: "set null" }),
  createdAt: d
    .timestamp({ mode: "date", withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: d
    .timestamp({ mode: "date", withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
}));

export const mentoringRelations = relations(mentoring, ({ one, many }) => ({
  userMentoringDatas: many(userMentoringData),
  category: one(category, {
    fields: [mentoring.categoryId],
    references: [category.id],
  }),
  mentor: one(mentor, {
    fields: [mentoring.mentorId],
    references: [mentor.id],
  }),
}));

export const userMentoringData = createTable(
  "userMentoringData",
  (d) => ({
    id: d
      .varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    objective: d.varchar({ length: 255 }).notNull(),
    preference: d.text(),
    positionPreference: d.text(),
    cv: d.varchar({ length: 255 }).notNull(),
    referral: d.varchar({ length: 255 }),
    mentoringId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => mentoring.id, { onDelete: "cascade" }),
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: d
      .timestamp({ mode: "date", withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d
      .timestamp({ mode: "date", withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  }),
  (t) => [unique("userMentorUnq").on(t.userId, t.mentoringId)],
);

export const userMentoringDataRelations = relations(
  userMentoringData,
  ({ one, many }) => ({
    mentoring: one(mentoring, {
      fields: [userMentoringData.mentoringId],
      references: [mentoring.id],
    }),
    user: one(users, {
      fields: [userMentoringData.userId],
      references: [users.id],
    }),
    schedules: many(mentoringSchedule),
    purchases: many(purchase),
  }),
);

export const mentoringSchedule = createTable("mentoringSchedule", (d) => ({
  id: d
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  date: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  status: requestStatus("status").default("PENDING"),
  message: d.text(),
  userMentoringDataId: d
    .varchar({ length: 255 })
    .notNull()
    .references(() => userMentoringData.id, { onDelete: "cascade" }),
  createdAt: d
    .timestamp({ mode: "date", withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: d
    .timestamp({ mode: "date", withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
}));

export const mentoringScheduleRelations = relations(
  mentoringSchedule,
  ({ one }) => ({
    userMentoringData: one(userMentoringData, {
      fields: [mentoringSchedule.userMentoringDataId],
      references: [userMentoringData.id],
    }),
  }),
);

/**
 * ======================== Invoice data ===========================
 *
 * Storing mentor data including :
 *  - invoice
 */
export const purchase = createTable("purchase", (d) => ({
  id: d
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: d
    .varchar({ length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  courseId: d
    .varchar({ length: 255 })
    .references(() => course.id, { onDelete: "set null" }),
  mentoringId: d
    .varchar({ length: 255 })
    .references(() => userMentoringData.id, { onDelete: "set null" }),
  status: purchaseStatus("status").default("PENDING"),
  invoiceId: d.varchar({ length: 255 }).unique(),
  invoiceUrl: d.varchar({ length: 255 }),
  createdAt: d
    .timestamp({ mode: "date", withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: d
    .timestamp({ mode: "date", withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
}));

export const purchaseRelations = relations(purchase, ({ one }) => ({
  user: one(users, {
    fields: [purchase.userId],
    references: [users.id],
  }),
  course: one(course, {
    fields: [purchase.courseId],
    references: [course.id],
  }),
  mentoring: one(userMentoringData, {
    fields: [purchase.mentoringId],
    references: [userMentoringData.id],
  }),
}));
