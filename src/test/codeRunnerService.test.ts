import { describe, it, expect } from 'vitest';
import { codeRunnerService } from '../services/codeRunnerService';

describe('SkillForge Offline CodeRunner Multi-Language Execution', () => {
  it('should execute JavaScript code and capture custom console logs', async () => {
    const code = `
      const x = 10;
      const y = 25;
      console.log('Sum is:', x + y);
    `;
    const result = await codeRunnerService.executeCode('js', code);
    expect(result.success).toBe(true);
    expect(result.stdout).toContain('Sum is: 35');
    expect(result.executionTimeMs).toBeGreaterThanOrEqual(0);
  });

  it('should execute Python print statements and expressions safely offline', async () => {
    const pyCode = `
# Sample Python script
print("Hello SkillForge Python")
print(10 * 5)
    `;
    const result = await codeRunnerService.executeCode('python', pyCode);
    expect(result.success).toBe(true);
    expect(result.stdout).toContain('Hello SkillForge Python');
    expect(result.stdout).toContain('50');
  });

  it('should simulate C++ compilation and standard output in browser sandbox', async () => {
    const cppCode = `
#include <iostream>
int main() {
    std::cout << "C++ Output Verified" << std::endl;
    return 0;
}
    `;
    const result = await codeRunnerService.executeCode('cpp', cppCode);
    expect(result.success).toBe(true);
    expect(result.stdout).toContain('C++ Output Verified');
  });

  it('should simulate Java class execution and System.out.println in browser sandbox', async () => {
    const javaCode = `
public class Main {
    public static void main(String[] args) {
        System.out.println("Java Sandbox Output");
    }
}
    `;
    const result = await codeRunnerService.executeCode('java', javaCode);
    expect(result.success).toBe(true);
    expect(result.stdout).toContain('Java Sandbox Output');
  });
});
