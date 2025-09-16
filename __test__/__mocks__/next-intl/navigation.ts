export const createNavigation = jest.fn().mockReturnValue({
  Link: jest.fn(),
  redirect: jest.fn(),
  usePathname: jest.fn(),
  useRouter: jest.fn(),
  getPathname: jest.fn(),
});

const navigationMock = {
  createNavigation,
};

export default navigationMock;
