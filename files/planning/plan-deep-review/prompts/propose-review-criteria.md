# Propose Review Criteria & Quality Standards

Your task is to **propose the review criteria, quality standards, and evaluation dimensions**.

## What to Do

Based on your context, propose:
1. **Review Criteria** — What quality dimensions will be evaluated? (e.g., correctness, performance, security, maintainability, compliance, architecture fitness)
2. **Quality Standards** — What standards, benchmarks, or best practices apply to each dimension? (domain-specific or industry standards)
3. **Evaluation Method** — How will each dimension be assessed? (code inspection, architectural review, metrics analysis, compliance validation, testing)
4. **Risk Focus** — Which criteria or areas need the most scrutiny given known risks?
5. **Standards Alignment** — How do these criteria align with applicable industry standards or organizational baselines?

For evaluations involving trade-offs between quality dimensions (e.g., strict standards vs. pragmatic trade-offs), you may use sequential-thinking to reason through priority and alignment.

## Output

- Review criteria (bulleted, clear dimensions)
- Quality standards for each (specific, measurable, with source/basis)
- Evaluation method per criterion
- Risk-focused areas requiring deep review
- Standards alignment and reasoning

Call `next_step()` to evaluate these criteria.
