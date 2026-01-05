export interface UseCase<F, S> {
  execute(input: F): S
}
