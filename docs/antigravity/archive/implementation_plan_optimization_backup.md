# Scheduling Engine - Advanced Optimization Implementation Plan

This plan addresses the missing features identified during the review of the Scheduling Engine against the design specifications. It focuses on implementing advanced optimization objectives: **Load Balancing** and **Gap Minimization**.

## Proposed Changes

### Backend Implementation

#### [MODIFY] [backend/src/modules/scheduling_engine/models.py](file:///d:/ReactJSLearning/Synapse/backend/src/modules/scheduling_engine/models.py)
- Update `SolveRequest` to allow tuning weights for new objectives (ensure `weight_fairness` and `weight_utilization` are leveraged correctly).

#### [MODIFY] [backend/src/modules/scheduling_engine/solver.py](file:///d:/ReactJSLearning/Synapse/backend/src/modules/scheduling_engine/solver.py)
- **Implement Load Balancing**:
    - Add `total_load` variables for each staff.
    - Add `min_load` and `max_load` variables.
    - Add `(max_load - min_load) * weight_fairness` to objective function.
- **Implement Gap Minimization**:
    - Add `span_var` for each staff (End of last task - Start of first task).
    - Add `(span_var - total_load) * weight_utilization` to objective function. This effectively minimizes the idle time *within* the working span.

#### [MODIFY] [backend/src/modules/scheduling_engine/evaluator.py](file:///d:/ReactJSLearning/Synapse/backend/src/modules/scheduling_engine/evaluator.py)
- Implement `total_idle_minutes` calculation in `evaluate_current_schedule` to properly measure gap reduction improvements.

## Verification Plan

### Automated Tests
Create a new test file `backend/src/tests/modules/scheduling_engine/test_optimization.py` covering:
1.  **Load Balancing**: Verify that tasks are distributed evenly among staff when possible (e.g., 2 tasks, 2 staff -> 1 each, not 2 for one).
2.  **Gap Minimization**: Verify that tasks for the same staff are scheduled contiguously (e.g., 9:00-10:00 and 10:00-11:00 preferred over 9:00-10:00 and 13:00-14:00).

**Command to run:**
```bash
pytest backend/src/tests/modules/scheduling_engine/test_optimization.py
```

### Manual Verification
1.  Run the backend server.
2.  Use `POST /api/v1/scheduling/solve` with a prepared dataset containing multiple available staff and tasks.
3.  Observe that the solver spreads tasks evenly (Fairness).
4.  Observe that sequential tasks for a single staff are packed together (Utilization).
