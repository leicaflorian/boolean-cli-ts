export const mockPlaySoundFile = jest.fn()

const mock = jest.fn().mockImplementation(() => {
  return { command: mockPlaySoundFile }
})

export default mock
