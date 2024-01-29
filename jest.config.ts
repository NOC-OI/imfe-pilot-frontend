const esModules = ['react-markdown'].join('|')

export default {
  testEnvironment: 'jsdom',
  preset: 'ts-jest',
  setupFilesAfterEnv: ['./jest.setup.js'],
  setupFiles: ['dotenv/config'],
  transformIgnorePatterns: [`/node_modules/react-markdown`],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleDirectories: ['node_modules', 'src', '__tests__'],
  moduleNameMapper: {
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/test/__mocks__/fileMock.js',
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    // 'react-leaflet': '<rootDir>/__mocks__/reactLeafletMock.js',
    'react-markdown': '<rootDir>/__mocks__/react-markdown.js',
    'react-plotly': '<rootDir>/__mocks__/react-plotly.js',
    '^.+\\.svg$': 'jest-svg-transformer',
    '^.+\\.(css|less|scss)$': 'identity-obj-proxy',
  },
}
