/**
 * Base Use Case
 * All application use cases should extend this class
 */
export abstract class BaseUseCase<TInput, TOutput> {
  abstract execute(input: TInput): Promise<TOutput>;
}
