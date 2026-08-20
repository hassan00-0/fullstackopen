import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Blog from "./Blog";

const blog = {
  id: "1",
  title: "Component testing is done with react-testing-library",
  author: "Kent C. Dodds",
  url: "https://testing-library.com",
  likes: 7,
  user: { id: "2", username: "mluukkai", name: "Matti Luukkainen" },
};

const creator = { username: "mluukkai", name: "Matti Luukkainen" };
const otherUser = { username: "hellas", name: "Arto Hellas" };

const renderBlog = (props) =>
  render(
    <MemoryRouter>
      <Blog blog={blog} {...props} />
    </MemoryRouter>,
  );

describe("<Blog />", () => {
  test("shows the blog details and likes but no buttons to a visitor", () => {
    renderBlog({ user: null });

    expect(
      screen.getByText("Component testing is done with react-testing-library", {
        exact: false,
      }),
    ).toBeDefined();
    expect(screen.getByText("Kent C. Dodds", { exact: false })).toBeDefined();
    expect(screen.getByText("https://testing-library.com")).toBeDefined();
    expect(screen.getByText("7 likes", { exact: false })).toBeDefined();

    expect(screen.queryByText("like")).toBeNull();
    expect(screen.queryByText("remove")).toBeNull();
  });

  test("shows only the like button to a logged in user who is not the creator", () => {
    renderBlog({ user: otherUser });

    expect(screen.getByText("like")).toBeDefined();
    expect(screen.queryByText("remove")).toBeNull();
  });

  test("shows the remove button to the creator of the blog", () => {
    renderBlog({ user: creator });

    expect(screen.getByText("like")).toBeDefined();
    expect(screen.getByText("remove")).toBeDefined();
  });

  test("clicking the like button twice calls the handler twice", async () => {
    const mockHandler = vi.fn();
    renderBlog({ user: creator, onLike: mockHandler });

    const user = userEvent.setup();
    const likeButton = screen.getByText("like");
    await user.click(likeButton);
    await user.click(likeButton);

    expect(mockHandler.mock.calls).toHaveLength(2);
  });
});
