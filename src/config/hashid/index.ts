import Hashids from 'hashids'
import { env } from '../env'

type Path = string

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type AnyType = any

type TransformFunction = (value: AnyType) => AnyType

export class HashidTransformer {
  private hashids: Hashids

  constructor(
    salt: string = env.HASHID_SALT,
    minLength = env.HASHID_MIN_LENGTH,
    alphabet = env.HASHID_ALPHABET,
  ) {
    this.hashids = new Hashids(salt, minLength, alphabet)
  }

  // Método para codificar IDs dentro de objetos
  deepEncode<T>(data: AnyType, paths: Path[]) {
    return this._processData(data, paths, (value: AnyType) =>
      this.encode(value),
    ) as T
  }

  // Método para codificar IDs individuais
  encode(value: AnyType): string {
    return this.hashids.encode(value)
  }

  // Método para decodificar IDs dentro de objetos
  deepDecode<T>(data: AnyType, paths: Path[]) {
    return this._processData(data, paths, (value: AnyType) => {
      return this.decode(value)
    }) as T
  }

  // Método para decodificar IDs individuais
  decode(value: string): number | null {
    const decoded = this.hashids.decode(value)
    return decoded.length ? (decoded[0] as number) : null // Retorna null se não puder decodificar
  }

  // Função para percorrer o objeto e modificar valores nas chaves especificadas
  private _processData<T>(
    data: T | T[],
    paths: Path[],
    transformFunc: TransformFunction,
  ): T | T[] {
    if (Array.isArray(data)) {
      return data.map((item) => this._applyPaths(item, paths, transformFunc))
    }
    return this._applyPaths(data, paths, transformFunc)
  }

  // Função que aplica a transformação em cada caminho especificado
  private _applyPaths<T>(
    obj: T,
    paths: Path[],
    transformFunc: TransformFunction,
  ): T {
    for (const path of paths) {
      const segments = path.split('.')
      this._applyPath(obj, segments, transformFunc)
    }

    return obj
  }

  // Função recursiva para navegar e aplicar a função de transformação nos valores especificados
  private _applyPath(
    obj: AnyType,
    segments: string[],
    transformFunc: TransformFunction,
  ): void {
    let current = obj
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i]

      if (segment === '[]') {
        // Percorre arrays
        if (Array.isArray(current)) {
          for (const item of current) {
            this._applyPath(item, segments.slice(i + 1), transformFunc)
          }
        }
        return
      }

      if (segment === '[*]' && Array.isArray(current)) {
        // Caso especial: array que contém apenas IDs
        current.forEach((item, index) => {
          current[index] = transformFunc(item)
        })
        return
      }

      if (i === segments.length - 1) {
        // Último segmento, aplica a função de transformação
        if (current && current[segment] !== undefined) {
          current[segment] = transformFunc(current[segment])
        }
      } else {
        // Navega no próximo nível do objeto
        current = current[segment]
        if (current === undefined) return
      }
    }
  }
}
