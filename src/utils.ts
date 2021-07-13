export function mat2Tex(m: number[][]) {
    const string = m.map((row) => {
      return row.map((col) => col).join(' & ')
    }).join(" \\\\ ")
    
    const s = `\\left(\\begin{matrix}
      ${string}
    \\end{matrix}\\right)`
    
    const ss = s.replace('/\/\g', '\\')
    
    return ss
}