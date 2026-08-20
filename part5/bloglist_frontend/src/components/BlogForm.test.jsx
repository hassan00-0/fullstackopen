import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import BlogForm from "./BlogForm";

test("<BlogForm /> calls createBlog with the right details", async () => {
  const createBlog = vi.fn();
  const user = userEvent.setup();

  render(
    <MemoryRouter>
      <BlogForm createBlog={createBlog} />
    </MemoryRouter>,
  );

  await user.type(screen.getByLabelText("title"), "Testing forms");
  await user.type(screen.getByLabelText("author"), "Kent C. Dodds");
  await user.type(screen.getByLabelText("url"), "https://testing-library.com");
  await user.click(screen.getByText("create"));

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: "Testing forms",
    author: "Kent C. Dodds",
    url: "https://testing-library.com",
  });
});
