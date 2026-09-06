import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, Route, Routes, useNavigate } from "react-router";
import { FiEdit2, FiEye, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import Sidebar from "./common/Sidebar";
import Header from "./common/Header";
import Login from "./Login";

const clearAdminSession = () => {
  localStorage.removeItem("admin_token");
  localStorage.removeItem("admin_data");
};
const Badge = ({ children }) => (
  <span className={`badge ${String(children).toLowerCase()}`}>{children}</span>
);
function Head({ title, children }) {
  return (
    <div className="page-head">
      <div>
        <p className="eyebrow">QUIZ NOVA / ADMIN</p>
        <h1>{title}</h1>
        <p>Manage your Quiz Nova learning platform.</p>
      </div>
      {children}
    </div>
  );
}
function Modal({ title, children, close }) {
  return (
    <div className="modal-bg">
      <div className="modal">
        <div className="modal-top">
          <h2>{title}</h2>
          <button onClick={close} aria-label="Close modal">
            <FiX />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
function Field({ label, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}
function Form({
  type,
  item,
  close,
  save,
  error,
  isSaving,
  categoryOptions = [],
  quizOptions = [],
}) {
  const isQuestion = type === "question";
  const [data, setData] = useState(
    item
      ? isQuestion
        ? {
            ...item,
            options:
              Array.isArray(item.options) && item.options.length
                ? item.options
                : [item.answer || "", "", ""],
          }
        : item
      : isQuestion
        ? {
            quiz: quizOptions[0]?.id || "",
            text: "",
            answer: "",
            options: ["", "", ""],
            explanation: "",
            marks: "",
            status: "Active",
          }
        : {
            title: "",
            category: categoryOptions[0]?.id || "",
            difficulty: "Beginner",
            time: "",
            questions: 0,
            status: "Active",
            description: "",
          },
  );
  const change = (e) => setData({ ...data, [e.target.name]: e.target.value });
  return (
    <Modal
      title={`${item ? "Edit" : "Add"} ${isQuestion ? "question" : "quiz"}`}
      close={close}
    >
      <form
        className="form-grid"
        onSubmit={async (e) => {
          e.preventDefault();
          const saved = await save({ ...data, id: item?.id || Date.now() });
          if (saved !== false) close();
        }}
      >
        {isQuestion ? (
          <>
            <Field label="Linked quiz">
              <select
                required
                disabled={Boolean(item)}
                name="quiz"
                value={data.quiz}
                onChange={change}
              >
                {quizOptions.length === 0 && (
                  <option value="">No quizzes available</option>
                )}
                {quizOptions.map((quiz) => (
                  <option key={quiz.id} value={quiz.id}>
                    {quiz.title}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Question text">
              <textarea
                required
                name="text"
                value={data.text}
                onChange={change}
              />
            </Field>
            <div className="options">
              <span>Answer options</span>
              {data.options.map((o, i) => (
                <input
                  required
                  key={i}
                  value={o}
                  placeholder={`Option ${"ABCD"[i]}`}
                  onChange={(e) =>
                    setData({
                      ...data,
                      options: data.options.map((x, n) =>
                        n === i ? e.target.value : x,
                      ),
                    })
                  }
                />
              ))}
            </div>
            <Field label="Correct option">
              <input
                required
                name="answer"
                value={data.answer}
                onChange={change}
              />
            </Field>
            <Field label="Explanation">
              <textarea
                required
                name="explanation"
                value={data.explanation ?? ""}
                onChange={change}
              />
            </Field>
            <Field label="Marks">
              <input
                required
                type="number"
                min="0"
                name="marks"
                value={data.marks ?? ""}
                onChange={change}
              />
            </Field>
            <Field label="Status">
              <select
                name="status"
                value={data.status ?? "Active"}
                onChange={change}
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </Field>
          </>
        ) : (
          <>
            <Field label="Quiz title">
              <input
                required
                name="title"
                value={data.title}
                onChange={change}
              />
            </Field>
            <Field label="Category">
              <select
                required
                name="category"
                value={data.category}
                onChange={change}
              >
                {item ? (
                  <>
                    <option>Programming</option>
                    <option>General Knowledge</option>
                    <option>Science</option>
                  </>
                ) : (
                  <>
                    {categoryOptions.length === 0 && (
                      <option value="">No categories available</option>
                    )}
                    {categoryOptions.map((categoryOption) => (
                      <option key={categoryOption.id} value={categoryOption.id}>
                        {categoryOption.name}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </Field>
            <Field label="Difficulty">
              <select
                name="difficulty"
                value={data.difficulty}
                onChange={change}
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </Field>
            <Field label="Time limit">
              <input
                required={!item}
                name="time"
                value={data.time}
                onChange={change}
              />
            </Field>
            <Field label="Linked question count">
              <input
                type="number"
                name="questions"
                value={data.questions}
                onChange={change}
              />
            </Field>
            <Field label="Status">
              <select name="status" value={data.status} onChange={change}>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </Field>
            <Field label="Description">
              <textarea
                required={!item}
                name="description"
                value={data.description}
                onChange={change}
              />
            </Field>
          </>
        )}
        {error && (
          <p className="dashboard-state" role="alert">
            {error}
          </p>
        )}
        <div className="form-actions">
          <button className="secondary-btn" type="button" onClick={close}>
            Cancel
          </button>
          <button className="primary-btn" disabled={isSaving}>
            {isSaving
              ? "Saving..."
              : `Save ${isQuestion ? "question" : "quiz"}`}
          </button>
        </div>
      </form>
    </Modal>
  );
}
function normalizeQuestion(question, quiz) {
  const options = Array.isArray(question.options) ? question.options : [];
  const optionText = (option) =>
    typeof option === "string"
      ? option
      : (option.text ??
        option.option_text ??
        option.value ??
        option.label ??
        "—");
  return {
    _id: question._id ?? question.id,
    id: question._id ?? question.id,
    quizId: quiz?.id ?? question.quiz?._id ?? question.quiz ?? "",
    quiz: quiz?.title ?? question.quiz?.title ?? "—",
    category: quiz?.category ?? question.quiz?.category?.name ?? "—",
    text: question.question_text ?? question.text ?? "—",
    answer: optionText(options.find((option) => option.is_correct)),
    options: options.map(optionText),
    explanation: question.explanation ?? "",
    marks: question.marks ?? "",
    status:
      question.status === true || question.status === "Active"
        ? "Active"
        : "Inactive",
  };
}
function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      setError("Your session is unavailable. Please sign in again.");
      setIsLoading(false);
      return;
    }
    let isMounted = true;
    const loadSummary = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/dashboard/summary`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (!data?._status)
          throw new Error(data?._message || "Unable to load dashboard data.");
        if (isMounted) setSummary(data._data);
      } catch (requestError) {
        if (!isMounted) return;
        if (
          requestError.response?.status === 401 ||
          requestError.response?.status === 403
        ) {
          localStorage.removeItem("admin_token");
          localStorage.removeItem("admin_data");
          navigate("/login", { replace: true });
          return;
        }
        setError(
          requestError.response?.data?._message ||
            requestError.message ||
            "Unable to load dashboard data.",
        );
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadSummary();
    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const dashboardStats = [
    [summary?.total_users, "Total users"],
    [summary?.total_quizzes, "Total quizzes"],
    [summary?.total_questions, "Total questions"],
    [summary?.total_attempts, "Quiz attempts"],
  ];
  const recentActivity = (summary?.recent_activity || []).map((activity) => ({
    id: activity._id,
    user: activity.user?.name || "—",
    quiz: activity.quiz?.title || "—",
    category: "—",
    correct: null,
    incorrect: null,
    percent: null,
    date: activity.submitted_at
      ? new Date(activity.submitted_at).toLocaleString()
      : "—",
    status: activity.status || "—",
  }));

  return (
    <>
      <Head title="Good morning, Admin" />
      {error && (
        <p className="dashboard-state" role="alert">
          {error}
        </p>
      )}
      <section className="stat-grid">
        {dashboardStats.map((x) => (
          <article className="stat-card" key={x[1]}>
            <p>{x[1]}</p>
            <b>{isLoading ? "Loading..." : (x[0] ?? "—")}</b>
            <small>+12.5% this month</small>
          </article>
        ))}
      </section>
      <section className="dashboard-grid">
        <div className="panel">
          <div className="panel-title">
            <div>
              <h2>Performance overview</h2>
              <p>Average quiz score over the last 7 days</p>
            </div>
          </div>
          <div className="bars">
            {[48, 68, 56, 80, 72, 86, 76].map((x, i) => (
              <div key={i}>
                <i style={{ height: `${x}%` }} />
                <span>
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <div className="panel-title">
            <div>
              <h2>Popular categories</h2>
              <p>By completed attempts</p>
            </div>
          </div>
          {[
            ["Programming", 82],
            ["General Knowledge", 62],
            ["Science", 48],
          ].map((x) => (
            <div className="category" key={x[0]}>
              <div>
                <b>{x[0]}</b>
                <span>{x[1]}%</span>
              </div>
              <i>
                <em style={{ width: `${x[1]}%` }} />
              </i>
            </div>
          ))}
        </div>
      </section>
      <section className="panel">
        <div className="panel-title">
          <div>
            <h2>Recent attempts</h2>
            <p>Latest learner activity</p>
          </div>
        </div>
        {isLoading ? (
          <p className="dashboard-state">Loading recent activity...</p>
        ) : (
          <AttemptTable rows={recentActivity} />
        )}
      </section>
    </>
  );
}
function Quizzes() {
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [edit, setEdit] = useState(null);
  const [add, setAdd] = useState(false);
  const [formError, setFormError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      setError("Your session is unavailable. Please sign in again.");
      setIsLoading(false);
      return;
    }
    let isMounted = true;
    const loadQuizzes = async () => {
      try {
        const { data } = await axios.get(
          new URL("/api/quizzes", import.meta.env.VITE_API_BASE_URL).toString(),
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (!data?._status)
          throw new Error(data?._message || "Unable to load quizzes.");
        if (isMounted)
          setList(
            (data._data || []).map((quiz) => ({
              id: quiz._id,
              categoryId: quiz.category?._id ?? "",
              title: quiz.title ?? "—",
              description: quiz.description ?? "—",
              category: quiz.category?.name ?? "—",
              difficulty: quiz.difficulty ?? "—",
              time:
                quiz.duration_minutes == null
                  ? "—"
                  : `${quiz.duration_minutes} min`,
              questions: null,
              status: quiz.status === true ? "Active" : "Inactive",
            })),
          );
      } catch (requestError) {
        if (!isMounted) return;
        if (
          requestError.response?.status === 401 ||
          requestError.response?.status === 403
        ) {
          localStorage.removeItem("admin_token");
          localStorage.removeItem("admin_data");
          navigate("/login", { replace: true });
          return;
        }
        setError(
          requestError.response?.data?._message ||
            requestError.message ||
            "Unable to load quizzes.",
        );
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadQuizzes();
    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const save = async (x) => {
    if (!edit) {
      const token = localStorage.getItem("admin_token");
      const durationMinutes = Number.parseInt(x.time, 10);
      if (!token) {
        setFormError("Your session is unavailable. Please sign in again.");
        return false;
      }
      if (
        !x.title.trim() ||
        !x.description.trim() ||
        !x.category ||
        Number.isNaN(durationMinutes)
      ) {
        setFormError("Please complete all required quiz fields.");
        return false;
      }
      setFormError("");
      setIsSaving(true);
      try {
        const { data } = await axios.post(
          new URL("/api/quizzes", import.meta.env.VITE_API_BASE_URL).toString(),
          {
            title: x.title,
            description: x.description,
            category: x.category,
            difficulty: x.difficulty,
            duration_minutes: durationMinutes,
            status: x.status === "Active",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );
        if (!data?._status)
          throw new Error(data?._message || "Unable to create quiz.");
        const createdQuiz = data._data;
        const categoryOption = categoryOptions.find(
          (option) =>
            option.id === createdQuiz.category || option.id === x.category,
        );
        setList((rows) => [
          {
            id: createdQuiz._id,
            categoryId: categoryOption?.id ?? x.category,
            title: createdQuiz.title ?? x.title,
            description: createdQuiz.description ?? x.description,
            category: categoryOption?.name ?? "—",
            difficulty: createdQuiz.difficulty ?? x.difficulty,
            time:
              createdQuiz.duration_minutes == null
                ? `${durationMinutes} min`
                : `${createdQuiz.duration_minutes} min`,
            questions: null,
            status: createdQuiz.status === true ? "Active" : "Inactive",
          },
          ...rows,
        ]);
        return true;
      } catch (requestError) {
        if (
          requestError.response?.status === 401 ||
          requestError.response?.status === 403
        ) {
          localStorage.removeItem("admin_token");
          localStorage.removeItem("admin_data");
          navigate("/login", { replace: true });
          return false;
        }
        setFormError(
          requestError.response?.data?._message ||
            requestError.message ||
            "Unable to create quiz.",
        );
        return false;
      } finally {
        setIsSaving(false);
      }
    }
    const token = localStorage.getItem("admin_token");
    if (!token) {
      setFormError("Your session is unavailable. Please sign in again.");
      return false;
    }
    const durationMinutes = Number.parseInt(x.time, 10);
    if (Number.isNaN(durationMinutes)) {
      setFormError("Time limit must be a number of minutes.");
      return false;
    }
    setFormError("");
    setIsSaving(true);
    try {
      const { data } = await axios.put(
        new URL(
          `/api/quizzes/${edit.id}`,
          import.meta.env.VITE_API_BASE_URL,
        ).toString(),
        {
          title: x.title,
          description: x.description,
          difficulty: x.difficulty,
          duration_minutes: durationMinutes,
          status: x.status === "Active",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (!data?._status)
        throw new Error(data?._message || "Unable to update quiz.");
      const updatedQuiz = data._data;
      setList((rows) =>
        rows.map((quiz) =>
          quiz.id === edit.id
            ? {
                ...quiz,
                title: updatedQuiz.title ?? quiz.title,
                description: updatedQuiz.description ?? quiz.description,
                difficulty: updatedQuiz.difficulty ?? quiz.difficulty,
                time:
                  updatedQuiz.duration_minutes == null
                    ? quiz.time
                    : `${updatedQuiz.duration_minutes} min`,
                status: updatedQuiz.status === true ? "Active" : "Inactive",
              }
            : quiz,
        ),
      );
      return true;
    } catch (requestError) {
      if (
        requestError.response?.status === 401 ||
        requestError.response?.status === 403
      ) {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_data");
        navigate("/login", { replace: true });
        return false;
      }
      setFormError(
        requestError.response?.data?._message ||
          requestError.message ||
          "Unable to update quiz.",
      );
      return false;
    } finally {
      setIsSaving(false);
    }
  };
  const removeQuiz = async (quiz) => {
    if (!window.confirm(`Delete "${quiz.title}"?`)) return;
    const token = localStorage.getItem("admin_token");
    if (!token) {
      setError("Your session is unavailable. Please sign in again.");
      return;
    }
    setError("");
    try {
      const { data } = await axios.delete(
        new URL(
          `/api/quizzes/${quiz.id}`,
          import.meta.env.VITE_API_BASE_URL,
        ).toString(),
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!data?._status)
        throw new Error(data?._message || "Unable to delete quiz.");
      setList((rows) => rows.filter((item) => item.id !== quiz.id));
    } catch (requestError) {
      if (
        requestError.response?.status === 401 ||
        requestError.response?.status === 403
      ) {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_data");
        navigate("/login", { replace: true });
        return;
      }
      setError(
        requestError.response?.data?._message ||
          requestError.message ||
          "Unable to delete quiz.",
      );
    }
  };
  const categories = [
    ...new Set(
      list
        .map((quiz) => quiz.category)
        .filter((categoryName) => categoryName !== "—"),
    ),
  ];
  const categoryOptions = [
    ...new Map(
      list
        .filter((quiz) => quiz.categoryId && quiz.category !== "—")
        .map((quiz) => [
          quiz.categoryId,
          { id: quiz.categoryId, name: quiz.category },
        ]),
    ).values(),
  ];
  const filteredList = list.filter((quiz) => {
    const searchTerm = search.trim().toLowerCase();
    const matchesSearch =
      !searchTerm ||
      quiz.title.toLowerCase().includes(searchTerm) ||
      quiz.description.toLowerCase().includes(searchTerm);
    return (
      matchesSearch &&
      (!category || quiz.category === category) &&
      (!status || quiz.status === status)
    );
  });
  return (
    <>
      <Head title="Quiz management">
        <button
          className="primary-btn"
          onClick={() => {
            setFormError("");
            setAdd(true);
          }}
        >
          <FiPlus /> Add quiz
        </button>
      </Head>
      <section className="panel table-panel">
        <Toolbar
          placeholder="Search quizzes..."
          searchValue={search}
          onSearchChange={setSearch}
          categoryOptions={categories}
          selectedCategory={category}
          onCategoryChange={setCategory}
          selectedStatus={status}
          onStatusChange={setStatus}
        />
        {error && (
          <p className="dashboard-state" role="alert">
            {error}
          </p>
        )}
        {isLoading ? (
          <p className="dashboard-state">Loading quizzes...</p>
        ) : list.length === 0 && !error ? (
          <p className="dashboard-state">No quizzes found.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Quiz</th>
                  <th>Category</th>
                  <th>Difficulty</th>
                  <th>Time</th>
                  <th>Questions</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filteredList.map((q) => (
                  <tr key={q.id}>
                    <td>
                      <b>{q.title}</b>
                      <small>{q.description}</small>
                    </td>
                    <td>{q.category}</td>
                    <td>
                      <Badge>{q.difficulty}</Badge>
                    </td>
                    <td>{q.time}</td>
                    <td>{q.questions ?? "—"}</td>
                    <td>
                      <Badge>{q.status}</Badge>
                    </td>
                    <td>
                      <Actions
                        edit={() => {
                          setFormError("");
                          setEdit(q);
                        }}
                        remove={() => removeQuiz(q)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      {add && (
        <Form
          type="quiz"
          close={() => setAdd(false)}
          save={save}
          error={formError}
          isSaving={isSaving}
          categoryOptions={categoryOptions}
        />
      )}{" "}
      {edit && (
        <Form
          type="quiz"
          item={edit}
          close={() => setEdit(null)}
          save={save}
          error={formError}
          isSaving={isSaving}
        />
      )}
    </>
  );
}
function Questions() {
  const [list, setList] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [edit, setEdit] = useState(null);
  const [add, setAdd] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      clearAdminSession();
      navigate("/login", { replace: true });
      return;
    }
    let isMounted = true;
    const loadQuestions = async () => {
      try {
        const quizResponse = await axios.get(
          new URL("/api/quizzes", import.meta.env.VITE_API_BASE_URL).toString(),
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (!quizResponse.data?._status)
          throw new Error(
            quizResponse.data?._message || "Unable to load quizzes.",
          );
        const fetchedQuizzes = (quizResponse.data._data || []).map((quiz) => ({
          id: quiz._id,
          title: quiz.title ?? "—",
          category: quiz.category?.name ?? "—",
        }));
        const responses = await Promise.all(
          fetchedQuizzes.map((quiz) =>
            axios
              .get(
                new URL(
                  `/api/questions/quiz/${quiz.id}`,
                  import.meta.env.VITE_API_BASE_URL,
                ).toString(),
                { headers: { Authorization: `Bearer ${token}` } },
              )
              .then((response) => ({ quiz, data: response.data })),
          ),
        );
        if (!isMounted) return;
        setQuizzes(fetchedQuizzes);
        setList(
          responses.flatMap(({ quiz, data }) =>
            data?._status
              ? (data._data || []).map((question) =>
                  normalizeQuestion(question, quiz),
                )
              : [],
          ),
        );
      } catch (requestError) {
        if (!isMounted) return;
        if (
          requestError.response?.status === 401 ||
          requestError.response?.status === 403
        ) {
          clearAdminSession();
          navigate("/login", { replace: true });
          return;
        }
        setError(
          requestError.response?.data?._message ||
            requestError.message ||
            "Unable to load questions.",
        );
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadQuestions();
    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const save = async (question) => {
    const token = localStorage.getItem("admin_token");
    const marks = Number(question.marks);
    if (!token) {
      clearAdminSession();
      navigate("/login", { replace: true });
      return false;
    }
    const trimmedOptions = question.options.map((option) => option.trim());
    const correctAnswer = question.answer.trim();
    if (
      !question.text.trim() ||
      !question.quiz ||
      !trimmedOptions.every(Boolean) ||
      !correctAnswer ||
      !question.explanation.trim() ||
      !Number.isFinite(marks) ||
      marks < 0
    ) {
      setFormError(
        "Please complete all required question fields with valid marks.",
      );
      return false;
    }
    if (
      trimmedOptions.filter((option) => option === correctAnswer).length !== 1
    ) {
      setFormError("The correct option must exactly match one answer option.");
      return false;
    }
    const options = trimmedOptions.map((text) => ({
      text,
      is_correct: text === correctAnswer,
    }));
    setFormError("");
    setIsSaving(true);
    try {
      const request = edit
        ? axios.put(
            new URL(
              `/api/questions/${edit.id}`,
              import.meta.env.VITE_API_BASE_URL,
            ).toString(),
            {
              question_text: question.text,
              options,
              explanation: question.explanation,
              marks,
              status: question.status === "Active",
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            },
          )
        : axios.post(
            new URL(
              "/api/questions",
              import.meta.env.VITE_API_BASE_URL,
            ).toString(),
            {
              quiz: question.quiz,
              question_text: question.text,
              options,
              explanation: question.explanation,
              marks,
              status: question.status === "Active",
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            },
          );
      const { data } = await request;
      if (!data?._status)
        throw new Error(
          data?._message || `Unable to ${edit ? "update" : "create"} question.`,
        );
      const savedQuestionData = data._data;
      if (!savedQuestionData)
        throw new Error(`Unable to ${edit ? "update" : "create"} question.`);
      const quiz = quizzes.find(
        (item) => item.id === (edit?.quizId || question.quiz),
      );
      const savedQuestion = normalizeQuestion(savedQuestionData, quiz);
      setList((rows) =>
        edit
          ? rows.map((item) => (item.id === edit.id ? savedQuestion : item))
          : [savedQuestion, ...rows],
      );
      return true;
    } catch (requestError) {
      if (
        requestError.response?.status === 401 ||
        requestError.response?.status === 403
      ) {
        clearAdminSession();
        navigate("/login", { replace: true });
        return false;
      }
      setFormError(
        requestError.response?.data?._message ||
          requestError.message ||
          `Unable to ${edit ? "update" : "create"} question.`,
      );
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const removeQuestion = async (question) => {
    if (!window.confirm(`Delete this question?`)) return;
    const token = localStorage.getItem("admin_token");
    if (!token) {
      clearAdminSession();
      navigate("/login", { replace: true });
      return;
    }
    setError("");
    try {
      const { data } = await axios.delete(
        new URL(
          `/api/questions/${question._id}`,
          import.meta.env.VITE_API_BASE_URL,
        ).toString(),
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!data?._status)
        throw new Error(data?._message || "Unable to delete question.");
      setList((rows) => rows.filter((item) => item._id !== question._id));
    } catch (requestError) {
      if (
        requestError.response?.status === 401 ||
        requestError.response?.status === 403
      ) {
        clearAdminSession();
        navigate("/login", { replace: true });
        return;
      }
      setError(
        requestError.response?.data?._message ||
          requestError.message ||
          "Unable to delete question.",
      );
    }
  };

  const categories = [
    ...new Set(
      [
        ...quizzes.map((quiz) => quiz.category),
        ...list.map((question) => question.category),
      ].filter((categoryName) => categoryName && categoryName !== "—"),
    ),
  ];
  const filteredList = list.filter((question) => {
    const searchTerm = search.trim().toLowerCase();
    const searchableText = [
      question.text,
      question.quiz,
      question.category,
      question.answer,
      question.options.join(" "),
      question.explanation,
      question.marks,
      question.status,
    ]
      .join(" ")
      .toLowerCase();
    const matchesSearch = !searchTerm || searchableText.includes(searchTerm);
    return (
      matchesSearch &&
      (!category || question.category === category) &&
      (!status || question.status === status)
    );
  });
  return (
    <>
      <Head title="Question management">
        <button
          className="primary-btn"
          onClick={() => {
            setFormError("");
            setAdd(true);
          }}
        >
          <FiPlus /> Add question
        </button>
      </Head>
      <section className="panel table-panel">
        <Toolbar
          placeholder="Search questions..."
          searchValue={search}
          onSearchChange={setSearch}
          categoryOptions={categories}
          selectedCategory={category}
          onCategoryChange={setCategory}
          selectedStatus={status}
          onStatusChange={setStatus}
        />
        {error && (
          <p className="dashboard-state" role="alert">
            {error}
          </p>
        )}
        {isLoading ? (
          <p className="dashboard-state">Loading questions...</p>
        ) : list.length === 0 && !error ? (
          <p className="dashboard-state">No questions found.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Question</th>
                  <th>Linked quiz</th>
                  <th>Correct option</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filteredList.map((q) => (
                  <tr key={q.id}>
                    <td>
                      <b>{q.text}</b>
                      <small>Options: {q.options.join(", ") || "—"}</small>
                      <small>
                        Explanation: {q.explanation || "—"} · Marks: {q.marks} ·
                        Status: {q.status}
                      </small>
                    </td>
                    <td>{q.quiz}</td>
                    <td className="correct-answer">{q.answer}</td>
                    <td>
                      <Actions
                        edit={() => {
                          setFormError("");
                          setEdit(q);
                        }}
                        remove={() => removeQuestion(q)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      {add && (
        <Form
          type="question"
          close={() => setAdd(false)}
          save={save}
          error={formError}
          isSaving={isSaving}
          quizOptions={quizzes}
        />
      )}{" "}
      {edit && (
        <Form
          type="question"
          item={edit}
          close={() => setEdit(null)}
          save={save}
          error={formError}
          isSaving={isSaving}
          quizOptions={quizzes}
        />
      )}
    </>
  );
}
function Toolbar({
  placeholder,
  searchValue,
  onSearchChange,
  categoryOptions,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
}) {
  return (
    <div className="table-toolbar">
      <input
        placeholder={placeholder}
        value={searchValue}
        onChange={(event) => onSearchChange?.(event.target.value)}
      />
      <select
        value={selectedCategory}
        onChange={(event) => onCategoryChange?.(event.target.value)}
      >
        <option value="">All categories</option>
        {categoryOptions?.map((categoryName) => (
          <option key={categoryName} value={categoryName}>
            {categoryName}
          </option>
        ))}
      </select>
      <select
        value={selectedStatus}
        onChange={(event) => onStatusChange?.(event.target.value)}
      >
        <option value="">All statuses</option>
        {onStatusChange && (
          <>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </>
        )}
      </select>
    </div>
  );
}
function Actions({ edit, remove }) {
  return (
    <div className="row-actions">
      <button onClick={edit}>
        <FiEdit2 />
      </button>
      <button onClick={remove}>
        <FiTrash2 />
      </button>
    </div>
  );
}
const identifierValues = (value) => {
  if (value == null) return [];
  if (typeof value !== "object") return [String(value)];
  return [value._id, value.id, value.$oid, value.user_id, value.userId].flatMap(
    identifierValues,
  );
};
function UserPerformance({ user }) {
  const [performance, setPerformance] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      clearAdminSession();
      navigate("/login", { replace: true });
      return;
    }
    let isMounted = true;
    const loadPerformance = async () => {
      try {
        const { data: quizData } = await axios.get(
          new URL("/api/quizzes", import.meta.env.VITE_API_BASE_URL).toString(),
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (!quizData?._status)
          throw new Error(quizData?._message || "Unable to load quizzes.");
        const quizzes = (quizData._data || []).map((quiz) => ({
          id: quiz._id,
          title: quiz.title ?? "—",
        }));
        const userIdentifiers = [user.id, user.name, user.email].flatMap(
          identifierValues,
        );
        const responses = await Promise.all(
          quizzes.map((quiz) =>
            axios
              .get(
                new URL(
                  `/api/attempts/quiz/${quiz.id}`,
                  import.meta.env.VITE_API_BASE_URL,
                ).toString(),
                { headers: { Authorization: `Bearer ${token}` } },
              )
              .then((response) => ({ quiz, data: response.data })),
          ),
        );
        if (!responses.every((response) => response.data?._status))
          throw new Error(
            responses.find((response) => !response.data?._status)?.data
              ?._message || "Unable to load performance data.",
          );
        const userAttempts = responses.flatMap(({ quiz, data }) =>
          (data._data || [])
            .filter((attempt) => {
              const attemptUser =
                attempt.user ?? attempt.student ?? attempt.learner;
              const attemptUserReferences = [
                attemptUser,
                attempt.user_id,
                attempt.userId,
              ];
              const attemptUserDetails =
                typeof attemptUser === "object"
                  ? [attemptUser.name, attemptUser.email, attemptUser.full_name]
                  : [];
              return [...attemptUserReferences, ...attemptUserDetails]
                .flatMap(identifierValues)
                .some((value) => userIdentifiers.includes(value));
            })
            .map((attempt) => {
              const rawResults =
                attempt.question_wise_results ??
                attempt.questionResults ??
                attempt.answers ??
                [];
              const hasResultCorrectness =
                Array.isArray(rawResults) &&
                rawResults.length > 0 &&
                rawResults.every(
                  (result) =>
                    typeof (result.is_correct ?? result.isCorrect) ===
                    "boolean",
                );
              const correctFromResults = hasResultCorrectness
                ? rawResults.filter(
                    (result) => result.is_correct ?? result.isCorrect,
                  ).length
                : null;
              const totalQuestions =
                attempt.total_questions ??
                attempt.totalQuestions ??
                (rawResults.length || null);
              const dateValue =
                attempt.submitted_at ??
                attempt.completed_at ??
                attempt.createdAt ??
                attempt.created_at;
              const percent =
                attempt.percentage ??
                attempt.percent ??
                attempt.score_percentage ??
                attempt.scorePercent ??
                (correctFromResults != null && totalQuestions
                  ? Math.round((correctFromResults / totalQuestions) * 100)
                  : null);
              const score =
                attempt.score ??
                attempt.marks_obtained ??
                attempt.obtained_marks ??
                attempt.marks;
              return {
                quiz: attempt.quiz?.title ?? quiz.title,
                percent: percent == null ? null : Number(percent),
                score,
                date: dateValue ? new Date(dateValue).getTime() : Number.NaN,
              };
            }),
        );
        const scoredAttempts = userAttempts.filter((attempt) =>
          Number.isFinite(attempt.percent),
        );
        const averageScore = scoredAttempts.length
          ? Math.round(
              scoredAttempts.reduce(
                (total, attempt) => total + attempt.percent,
                0,
              ) / scoredAttempts.length,
            )
          : null;
        const recentAttempt = [...userAttempts].sort(
          (first, second) => second.date - first.date,
        )[0];
        if (isMounted)
          setPerformance({
            averageScore,
            totalAttempts: userAttempts.length,
            recentAttempt,
          });
      } catch (requestError) {
        if (!isMounted) return;
        if (
          requestError.response?.status === 401 ||
          requestError.response?.status === 403
        ) {
          clearAdminSession();
          navigate("/login", { replace: true });
          return;
        }
        setError(
          requestError.response?.data?._message ||
            requestError.message ||
            "Unable to load performance data.",
        );
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadPerformance();
    return () => {
      isMounted = false;
    };
  }, [navigate, user]);

  if (isLoading)
    return <p className="dashboard-state">Loading performance...</p>;
  if (error)
    return (
      <p className="dashboard-state" role="alert">
        {error}
      </p>
    );
  const recentAttempt = performance?.recentAttempt;
  return (
    <div className="result-detail">
      {performance?.totalAttempts === 0 && (
        <p className="dashboard-state">No completed quiz attempts found.</p>
      )}
      <div className="attempt-details-grid">
        <div>
          <span>Average score</span>
          <b>
            {performance?.averageScore == null
              ? "—"
              : `${performance.averageScore}%`}
          </b>
        </div>
        <div>
          <span>Completed quiz attempts</span>
          <b>{performance?.totalAttempts ?? "—"}</b>
        </div>
        <div>
          <span>Recent quiz</span>
          <b>{recentAttempt?.quiz ?? "—"}</b>
        </div>
        <div>
          <span>Recent score</span>
          <b>
            {recentAttempt?.percent != null &&
            Number.isFinite(recentAttempt.percent)
              ? `${recentAttempt.percent}%`
              : displayValue(recentAttempt?.score)}
          </b>
        </div>
      </div>
    </div>
  );
}
function Users() {
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      clearAdminSession();
      navigate("/login", { replace: true });
      return;
    }
    let isMounted = true;
    const loadUsers = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/users`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (!data?._status)
          throw new Error(data?._message || "Unable to load users.");
        if (isMounted)
          setList(
            (data._data || []).map((user) => ({
              id: user._id,
              name: user.name ?? "—",
              email: user.email ?? "—",
              role: user.role_type ?? "—",
              status: user.status === true ? "Active" : "Inactive",
              joined: user.created_at
                ? new Date(user.created_at).toLocaleDateString()
                : "—",
            })),
          );
      } catch (requestError) {
        if (!isMounted) return;
        if (
          requestError.response?.status === 401 ||
          requestError.response?.status === 403
        ) {
          clearAdminSession();
          navigate("/login", { replace: true });
          return;
        }
        setError(
          requestError.response?.data?._message ||
            requestError.message ||
            "Unable to load users.",
        );
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadUsers();
    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const filteredList = list.filter((user) => {
    const searchTerm = search.trim().toLowerCase();
    const matchesSearch =
      !searchTerm ||
      [user.name, user.email, user.role]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm);
    return (
      matchesSearch &&
      (!role || user.role === role) &&
      (!status || user.status === status)
    );
  });

  const [chosenUser, setChosenUser] = useState(null);
  return (
    <>
      <Head title="User management" />
      <section className="panel table-panel">
        <div className="table-toolbar">
          <input
            placeholder="Search users..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <select
            value={role}
            onChange={(event) => setRole(event.target.value)}
          >
            <option value="">All roles</option>
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="">All statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        {error && (
          <p className="dashboard-state" role="alert">
            {error}
          </p>
        )}
        {isLoading ? (
          <p className="dashboard-state">Loading users...</p>
        ) : error ? null : list.length === 0 ? (
          <p className="dashboard-state">No users found.</p>
        ) : filteredList.length === 0 ? (
          <p className="dashboard-state">
            No users match the selected filters.
          </p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Performance</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filteredList.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <b>{user.name}</b>
                      <small>{user.email}</small>
                    </td>
                    <td>{user.role}</td>
                    <td>
                      <Badge>{user.status}</Badge>
                    </td>
                    <td>{user.joined}</td>
                    <td>—</td>
                    <td>
                      <button
                        className="view-btn"
                        onClick={() => setChosenUser(user)}
                      >
                        <FiEye /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      {chosenUser && (
        <Modal
          title={`${chosenUser.name} performance`}
          close={() => setChosenUser(null)}
        >
          <UserPerformance user={chosenUser} />
        </Modal>
      )}
    </>
  );
}
function AttemptTable({ rows, view }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Learner</th>
            <th>Quiz</th>
            <th>Category</th>
            <th>Score</th>
            <th>Percentage</th>
            <th>Date</th>
            <th>Status</th>
            {view && <th />}
          </tr>
        </thead>
        <tbody>
          {rows.map((a, i) => (
            <tr key={a.id || i}>
              <td>
                <b>{a.user}</b>
              </td>
              <td>{a.quiz}</td>
              <td>{a.category}</td>
              <td>
                {a.correct == null && a.incorrect == null ? (
                  (a.score ?? "—")
                ) : (
                  <>
                    <span className="correct-answer">
                      {a.correct ?? "—"} correct
                    </span>{" "}
                    · {a.incorrect ?? "—"} incorrect
                  </>
                )}
              </td>
              <td>
                <b>{a.percent == null ? "—" : `${a.percent}%`}</b>
              </td>
              <td>{a.date}</td>
              <td>
                <Badge>{a.status}</Badge>
              </td>
              {view && (
                <td>
                  <button className="view-btn" onClick={() => view(a)}>
                    <FiEye /> Details
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
const isObjectId = (value) =>
  typeof value === "string" && /^[a-f\d]{24}$/i.test(value);
const displayValue = (value) => {
  if (value == null || value === "" || isObjectId(value)) return "—";
  if (typeof value === "object")
    return (
      value.text ??
      value.option_text ??
      value.label ??
      value.value ??
      value.answer ??
      "—"
    );
  return String(value);
};
const formatDuration = (value) => {
  if (value == null || value === "") return "—";
  if (typeof value === "string" && !/^\d+(?:\.\d+)?$/.test(value.trim()))
    return value;
  const seconds = Number(value);
  if (!Number.isFinite(seconds)) return "—";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  return minutes ? `${minutes}m ${remainingSeconds}s` : `${remainingSeconds}s`;
};
function AttemptDetails({ attempt }) {
  const totalQuestions =
    attempt.totalQuestions ??
    attempt.total_questions ??
    (attempt.correct != null && attempt.incorrect != null
      ? Number(attempt.correct) + Number(attempt.incorrect)
      : "—");
  const timeTaken = formatDuration(attempt.timeTaken ?? attempt.time_taken);
  const questionResults =
    attempt.questionResults ??
    attempt.question_wise_results ??
    attempt.questions ??
    [];
  return (
    <div className="result-detail">
      <div className="attempt-summary">
        <Badge>{attempt.status}</Badge>
        <b className="attempt-percent">
          {attempt.percent == null ? "—" : `${attempt.percent}%`}
        </b>
        <span>Score percentage</span>
      </div>
      <div className="attempt-details-grid">
        <div>
          <span>Learner</span>
          <b>{attempt.user}</b>
        </div>
        <div>
          <span>Quiz</span>
          <b>{attempt.quiz}</b>
        </div>
        <div>
          <span>Category</span>
          <b>{attempt.category}</b>
        </div>
        <div>
          <span>Total questions</span>
          <b>{totalQuestions}</b>
        </div>
        <div>
          <span>Correct answers</span>
          <b className="correct-answer">{attempt.correct ?? "—"}</b>
        </div>
        <div>
          <span>Incorrect answers</span>
          <b>{attempt.incorrect ?? "—"}</b>
        </div>
        <div>
          <span>Time taken</span>
          <b>{timeTaken}</b>
        </div>
        <div>
          <span>Attempt date & time</span>
          <b>{attempt.date}</b>
        </div>
      </div>
      <section className="question-wise-result">
        <h3>Question-wise Result</h3>
        {Array.isArray(questionResults) && questionResults.length > 0 ? (
          <div className="question-result-list">
            {questionResults.map((result, index) => {
              const correct =
                result.isCorrect ??
                result.is_correct ??
                result.status === "Correct";
              return (
                <article
                  key={result.id ?? index}
                  className="question-result-row"
                >
                  <div>
                    <span>Question {index + 1}</span>
                    <b>
                      {displayValue(
                        result.question ??
                          result.questionText ??
                          result.question_text,
                      )}
                    </b>
                  </div>
                  <div>
                    <span>Selected answer</span>
                    <b>
                      {displayValue(
                        result.selectedAnswer ??
                          result.selected_answer ??
                          result.selectedOption ??
                          result.selected_option ??
                          result.answer,
                      )}
                    </b>
                  </div>
                  <div>
                    <span>Correct answer</span>
                    <b>
                      {displayValue(
                        result.correctAnswer ??
                          result.correct_answer ??
                          result.correctOption ??
                          result.correct_option,
                      )}
                    </b>
                  </div>
                  <Badge>{correct ? "Correct" : "Incorrect"}</Badge>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="question-data-empty">
            Question-wise data is not available for this attempt.
          </p>
        )}
      </section>
    </div>
  );
}
function Attempts() {
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [chosen, setChosen] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      clearAdminSession();
      navigate("/login", { replace: true });
      return;
    }
    let isMounted = true;
    const loadAttempts = async () => {
      try {
        const { data: quizData } = await axios.get(
          new URL("/api/quizzes", import.meta.env.VITE_API_BASE_URL).toString(),
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (!quizData?._status)
          throw new Error(quizData?._message || "Unable to load quizzes.");
        const quizzes = (quizData._data || []).map((quiz) => ({
          id: quiz._id,
          title: quiz.title ?? "—",
          category: quiz.category?.name ?? "—",
        }));
        const responses = await Promise.all(
          quizzes.map((quiz) =>
            axios
              .get(
                new URL(
                  `/api/attempts/quiz/${quiz.id}`,
                  import.meta.env.VITE_API_BASE_URL,
                ).toString(),
                { headers: { Authorization: `Bearer ${token}` } },
              )
              .then((response) => ({ quiz, data: response.data })),
          ),
        );
        if (!responses.every((response) => response.data?._status))
          throw new Error(
            responses.find((response) => !response.data?._status)?.data
              ?._message || "Unable to load attempts.",
          );
        const questionResponses = await Promise.all(
          quizzes.map(async (quiz) => {
            try {
              const response = await axios.get(
                new URL(
                  `/api/questions/quiz/${quiz.id}`,
                  import.meta.env.VITE_API_BASE_URL,
                ).toString(),
                { headers: { Authorization: `Bearer ${token}` } },
              );
              return response.data?._status ? response.data._data || [] : [];
            } catch {
              return [];
            }
          }),
        );
        const questionsById = new Map(
          questionResponses
            .flat()
            .map((question) => [question._id ?? question.id, question]),
        );
        if (!isMounted) return;
        const mappedAttempts = responses.flatMap(({ quiz, data }) =>
          (data._data || []).map((attempt) => {
            const rawResults =
              attempt.question_wise_results ??
              attempt.questionResults ??
              attempt.answers ??
              [];
            const results = Array.isArray(rawResults)
              ? rawResults.map((result) => {
                  const questionReference =
                    result.question ?? result.question_id ?? result.questionId;
                  const question =
                    typeof questionReference === "object"
                      ? questionReference
                      : questionsById.get(questionReference);
                  const options = Array.isArray(question?.options)
                    ? question.options
                    : [];
                  const optionText = (option) => displayValue(option);
                  const resolveOption = (value) => {
                    if (value == null || value === "") return undefined;
                    const found = options.find(
                      (option) =>
                        (option._id ?? option.id) === value ||
                        option.value === value ||
                        option.text === value ||
                        option.option_text === value,
                    );
                    return found ? optionText(found) : value;
                  };
                  const selected =
                    result.selectedAnswer ??
                    result.selected_answer ??
                    result.selectedOption ??
                    result.selected_option ??
                    result.answer;
                  const correctAnswer =
                    result.correctAnswer ??
                    result.correct_answer ??
                    result.correctOption ??
                    result.correct_option ??
                    options.find(
                      (option) => option.is_correct ?? option.isCorrect,
                    );
                  return {
                    ...result,
                    question:
                      question?.question_text ??
                      question?.text ??
                      questionReference,
                    selectedAnswer: resolveOption(selected),
                    correctAnswer: resolveOption(correctAnswer),
                  };
                })
              : [];
            const hasResultCorrectness =
              Array.isArray(results) &&
              results.length > 0 &&
              results.every(
                (result) =>
                  typeof (result.is_correct ?? result.isCorrect) === "boolean",
              );
            const correctFromResults = hasResultCorrectness
              ? results.filter(
                  (result) => result.is_correct ?? result.isCorrect,
                ).length
              : null;
            const incorrectFromResults = hasResultCorrectness
              ? results.filter(
                  (result) => !(result.is_correct ?? result.isCorrect),
                ).length
              : null;
            const dateValue =
              attempt.submitted_at ??
              attempt.completed_at ??
              attempt.createdAt ??
              attempt.created_at;
            const attemptUser =
              attempt.user ?? attempt.student ?? attempt.learner;
            const user =
              typeof attemptUser === "string"
                ? attemptUser
                : (attemptUser?.name ??
                  attemptUser?.full_name ??
                  attemptUser?.email ??
                  "—");
            const totalQuestions =
              attempt.total_questions ??
              attempt.totalQuestions ??
              (results.length || null);
            const percent =
              attempt.percentage ??
              attempt.percent ??
              attempt.score_percentage ??
              attempt.scorePercent ??
              (correctFromResults != null && totalQuestions
                ? Math.round((correctFromResults / totalQuestions) * 100)
                : null);
            const startedAt = attempt.started_at ?? attempt.startedAt;
            const duration =
              attempt.time_taken ??
              attempt.timeTaken ??
              attempt.duration ??
              attempt.duration_seconds ??
              attempt.time_spent ??
              (startedAt && dateValue
                ? Math.max(
                    0,
                    Math.round(
                      (new Date(dateValue) - new Date(startedAt)) / 1000,
                    ),
                  )
                : null);
            return {
              id: attempt._id ?? attempt.id,
              user,
              quiz: attempt.quiz?.title ?? quiz.title,
              category: attempt.quiz?.category?.name ?? quiz.category,
              correct:
                attempt.correct_answers ??
                attempt.correct ??
                attempt.correct_count ??
                correctFromResults,
              incorrect:
                attempt.incorrect_answers ??
                attempt.incorrect ??
                attempt.incorrect_count ??
                incorrectFromResults,
              score:
                attempt.score ??
                attempt.marks_obtained ??
                attempt.obtained_marks ??
                attempt.marks ??
                null,
              percent,
              date: dateValue ? new Date(dateValue).toLocaleString() : "—",
              status: attempt.status ?? "—",
              total_questions: totalQuestions,
              time_taken: duration,
              question_wise_results: results,
            };
          }),
        );
        setList(mappedAttempts);
      } catch (requestError) {
        if (!isMounted) return;
        if (
          requestError.response?.status === 401 ||
          requestError.response?.status === 403
        ) {
          clearAdminSession();
          navigate("/login", { replace: true });
          return;
        }
        setError(
          requestError.response?.data?._message ||
            requestError.message ||
            "Unable to load attempts.",
        );
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadAttempts();
    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const categories = [
    ...new Set(
      list
        .map((attempt) => attempt.category)
        .filter((value) => value && value !== "—"),
    ),
  ];
  const statuses = [
    ...new Set(
      list
        .map((attempt) => attempt.status)
        .filter((value) => value && value !== "—"),
    ),
  ];
  const filteredList = list.filter((attempt) => {
    const searchTerm = search.trim().toLowerCase();
    const searchableText = [
      attempt.user,
      attempt.quiz,
      attempt.category,
      attempt.status,
      attempt.score,
      attempt.percent,
      attempt.date,
    ]
      .join(" ")
      .toLowerCase();
    return (
      (!searchTerm || searchableText.includes(searchTerm)) &&
      (!category || attempt.category === category) &&
      (!status || attempt.status === status)
    );
  });

  return (
    <>
      <Head title="Attempts & results" />
      <section className="panel table-panel">
        <div className="table-toolbar">
          <input
            placeholder="Search learner or quiz..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="">All categories</option>
            {categories.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="">All statuses</option>
            {statuses.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        {error && (
          <p className="dashboard-state" role="alert">
            {error}
          </p>
        )}
        {isLoading ? (
          <p className="dashboard-state">Loading attempts...</p>
        ) : list.length === 0 && !error ? (
          <p className="dashboard-state">No attempts found.</p>
        ) : (
          <AttemptTable rows={filteredList} view={setChosen} />
        )}
      </section>
      {chosen && (
        <Modal title="Detailed attempt result" close={() => setChosen(null)}>
          <AttemptDetails attempt={chosen} />
        </Modal>
      )}
    </>
  );
}

function AdminLayout() {
  const [menu, setMenu] = useState(false);
  return (
    <div className="quiz-app">
      <Sidebar isOpen={menu} onClose={() => setMenu(false)} />
      {menu && (
        <button className="sidebar-overlay" onClick={() => setMenu(false)} />
      )}
      <Header onMenuClick={() => setMenu(true)} />
      <main className="quiz-main">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/quizzes" element={<Quizzes />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/users" element={<Users />} />
          <Route path="/attempts" element={<Attempts />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function QuizAdmin() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/*" element={<AdminLayout />} />
    </Routes>
  );
}

{
  /* npm run seed:admin -- --name="Admin Nova" --email="admin@example.com" --password="strong-password" */
}
