export const createVec3 = (x = 0, y = 0, z = 0) => {
  return {
    copy (vec3: THREE.Vector3) {
      this.x = vec3.x
      this.y = vec3.y
      this.z = vec3.z
      return this
    },
    setFromMatrixPosition (m4: THREE.Matrix4) {
      const { elements } = m4
      this.x = elements[12]
      this.y = elements[13]
      this.z = elements[14]
      return this
    },
    x,
    y,
    z,
  } as THREE.Vector3
}

export const createQuat = () => {
  return {
    copy (quat: THREE.Quaternion) {
      this.x = quat.x
      this.y = quat.y
      this.z = quat.z
      this.w = quat.w
    },
    setFromRotationMatrix (m4: THREE.Matrix4) {
      const te = m4.elements

      const m11 = te[0]
      const m12 = te[4]
      const m13 = te[8]
      const m21 = te[1]
      const m22 = te[5]
      const m23 = te[9]
      const m31 = te[2]
      const m32 = te[6]
      const m33 = te[10]

      const trace = m11 + m22 + m33

      if (trace > 0) {
        const s = 0.5 / Math.sqrt(trace + 1.0)

        this.w = 0.25 / s
        this.x = (m32 - m23) * s
        this.y = (m13 - m31) * s
        this.z = (m21 - m12) * s
      } else if (m11 > m22 && m11 > m33) {
        const s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33)

        this.w = (m32 - m23) / s
        this.x = 0.25 * s
        this.y = (m12 + m21) / s
        this.z = (m13 + m31) / s
      } else if (m22 > m33) {
        const s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33)

        this.w = (m13 - m31) / s
        this.x = (m12 + m21) / s
        this.y = 0.25 * s
        this.z = (m23 + m32) / s
      } else {
        const s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22)

        this.w = (m21 - m12) / s
        this.x = (m13 + m31) / s
        this.y = (m23 + m32) / s
        this.z = 0.25 * s
      }
    },
    w: 0,
    x: 0,
    y: 0,
    z: 0,
  } as THREE.Quaternion
}

const zero = createVec3(0, 0, 0)
const one = createVec3(1, 1, 1)

export const createM4 = () => {
  return {
    elements: [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ],
    fromArray (array, offset = 0) {
      for (let i = 0; i < 16; i += 1) {
        this.elements[i] = array[i + offset]
      }

      return this
    },
    makeRotationFromQuaternion (quaternion: THREE.Quaternion) {
      const te = this.elements

      const { x, y, z, w } = quaternion
      const x2 = x + x
      const y2 = y + y
      const z2 = z + z
      const xx = x * x2
      const xy = x * y2
      const xz = x * z2
      const yy = y * y2
      const yz = y * z2
      const zz = z * z2
      const wx = w * x2
      const wy = w * y2
      const wz = w * z2

      const sx = one.x
      const sy = one.y
      const sz = one.z

      te[0] = (1 - (yy + zz)) * sx
      te[1] = (xy + wz) * sx
      te[2] = (xz - wy) * sx
      te[3] = 0

      te[4] = (xy - wz) * sy
      te[5] = (1 - (xx + zz)) * sy
      te[6] = (yz + wx) * sy
      te[7] = 0

      te[8] = (xz + wy) * sz
      te[9] = (yz - wx) * sz
      te[10] = (1 - (xx + yy)) * sz
      te[11] = 0

      te[12] = zero.x
      te[13] = zero.y
      te[14] = zero.z
      te[15] = 1

      return this
    },
    setPosition (v: THREE.Vector3) {
      const te = this.elements
      te[12] = v.x
      te[13] = v.y
      te[14] = v.z
      return this
    },
    toArray (array = [], offset = 0) {
      const te = this.elements
      const arr = array as number[]

      arr[offset] = te[0]
      arr[offset + 1] = te[1]
      arr[offset + 2] = te[2]
      arr[offset + 3] = te[3]

      arr[offset + 4] = te[4]
      arr[offset + 5] = te[5]
      arr[offset + 6] = te[6]
      arr[offset + 7] = te[7]

      arr[offset + 8] = te[8]
      arr[offset + 9] = te[9]
      arr[offset + 10] = te[10]
      arr[offset + 11] = te[11]

      arr[offset + 12] = te[12]
      arr[offset + 13] = te[13]
      arr[offset + 14] = te[14]
      arr[offset + 15] = te[15]

      return arr
    },
  } as THREE.Matrix4
}
