---
trigger: manual
---

Tối ưu hóa Trải nghiệm Khách hàng và Hiệu quả Vận hành trong Ngành Spa Một Khung Giải pháp Lập lịch Đa Mục tiêu Thông minh
Tóm tắt Điều hành
Ngành công nghiệp chăm sóc sức khỏe và sắc đẹp (Wellness & Spa) đang trải qua một giai đoạn chuyển đổi số mạnh mẽ, nơi mà sự cạnh tranh không còn chỉ nằm ở chất lượng dịch vụ cốt lõi mà đã mở rộng sang chất lượng trải nghiệm vận hành. Các phương pháp quản lý lịch hẹn truyền thống—thường dựa trên bảng tính thủ công hoặc các thuật toán xếp lịch cứng nhắc tập trung thuần túy vào việc lấp đầy thời gian—đang ngày càng bộc lộ những hạn chế nghiêm trọng. Những hạn chế này biểu hiện qua thời gian chờ đợi của khách hàng kéo dài, sự mất cân bằng trong tải công việc của kỹ thuật viên (KTV), và khả năng phản ứng kém trước các sự cố bất ngờ như hủy lịch hay khách đến muộn.
Báo cáo nghiên cứu này đề xuất một cấu trúc toàn diện cho Đồ án Tốt nghiệp, chuyển trọng tâm từ kỹ thuật xếp lịch đa thiết bị (multi-device scheduling) đơn thuần sang một mô hình tối ưu hóa đa mục tiêu (Multi-Objective Optimization). Giải pháp được xây dựng dựa trên sự kết hợp giữa Lập trình Ràng buộc (Constraint Programming) và các thước đo sự hài lòng định lượng, nhằm đạt được sự cân bằng tinh tế giữa hiệu quả khai thác tài nguyên (Revenue Per Available Treatment Hour - RevPATH) và Chỉ số Hài lòng Khách hàng (CSAT). Bằng cách phân tích sâu sắc các "điểm đau" (pain points) thực tế và áp dụng các lý thuyết tiên tiến về Lập lịch Phản ứng (Reactive Scheduling) và Chỉ số Công bằng Jain (Jain's Fairness Index), báo cáo này cung cấp một lộ trình chi tiết từ cơ sở lý thuyết đến kiến trúc giải pháp thực tiễn.
1. Giới thiệu: Sự Dịch chuyển Mô hình trong Quản lý Vận hành Spa
1.1 Bối cảnh Ngành và Nhu cầu Chuyển đổi Số
Trong thập kỷ qua, ngành Spa đã phát triển từ một dịch vụ xa xỉ trở thành một nhu cầu thiết yếu trong lối sống hiện đại, hứa hẹn sự thư giãn, phục hồi và trao quyền cho khách hàng.1 Tuy nhiên, sự gia tăng về nhu cầu cũng đi kèm với áp lực vận hành to lớn. Khách hàng ngày nay sở hữu kỳ vọng cao hơn bao giờ hết; họ mong muốn sự tiện lợi tức thì, khả năng đặt lịch 24/7 và sự cá nhân hóa sâu sắc trong dịch vụ.2
Thực tế cho thấy, việc hiện đại hóa hoạt động kinh doanh là điều cần thiết để tồn tại và phát triển. Các hệ thống đặt lịch kỹ thuật số không chỉ giúp tiết kiệm thời gian quản lý mà còn là công cụ marketing đo lường được, cung cấp kết quả rõ ràng thông qua phân tích dữ liệu.2 Tuy nhiên, việc áp dụng công nghệ không chỉ dừng lại ở việc số hóa sổ hẹn. Vấn đề cốt lõi nằm ở "trí thông minh" của hệ thống xếp lịch. Một hệ thống chỉ biết ghi nhận giờ hẹn mà không tối ưu hóa được dòng chảy (flow) của khách hàng và nhân viên sẽ chỉ dẫn đến sự hỗn loạn kỹ thuật số thay vì hiệu quả thực sự.3
1.2 Phân tích Các Vấn đề Thực tế (Problem Statement)
Để xây dựng một giải pháp có ý nghĩa cho đồ án tốt nghiệp, cần phải thấu hiểu sâu sắc các vấn đề thực tế đang làm xói mòn lợi nhuận và uy tín của các Spa:
1.2.1 Ma sát trong Quy trình Đặt lịch và Chờ đợi
Nghiên cứu chỉ ra rằng sự cần thiết phải gọi điện thoại để đặt lịch là một rào cản lớn. Khách hàng hiện đại coi việc gọi điện là tốn công sức và thời gian.4 Hơn nữa, khả năng tiếp cận dịch vụ (Access Time) là yếu tố then chốt; nếu khách hàng không thể tìm thấy khung giờ phù hợp ngay lập tức, họ sẽ chuyển sang đối thủ cạnh tranh. Ngay cả khi đã đặt lịch, việc phải chờ đợi tại sảnh do KTV chưa sẵn sàng (do ca trước bị kéo dài) là nguyên nhân hàng đầu gây sụt giảm CSAT.4
1.2.2 Bài toán Ưu tiên Kỹ thuật viên (KTV) và Sự Công bằng
Trong ngành Spa, kỹ năng và thái độ của nhân viên là động lực quan trọng nhất tạo nên sự hài lòng.1 Điều này dẫn đến hiện tượng "KTV ngôi sao": một số nhân viên được yêu cầu liên tục, dẫn đến quá tải, trong khi những người khác lại rảnh rỗi. Các hệ thống xếp lịch cổ điển thường xử lý theo nguyên tắc "đến trước phục vụ trước" (FCFS) mà không tính toán đến việc cân bằng tải hoặc tối ưu hóa sở thích khách hàng một cách mềm dẻo.6
1.2.3 Sự Gián đoạn và Tính Bền vững của Lịch trình
Môi trường Spa mang tính ngẫu nhiên cao (stochastic). Khách hàng có thể hủy lịch phút chót (No-show), đến muộn, hoặc một liệu trình có thể kéo dài hơn dự kiến. Các hệ thống cứng nhắc sẽ bị "vỡ trận" trước những biến động này, buộc nhân viên lễ tân phải sắp xếp lại thủ công một cách vất vả, thường dẫn đến sai sót và sự không hài lòng lan truyền.2
1.3 Mục tiêu và Phạm vi của Đồ án
Đồ án không chỉ dừng lại ở việc xây dựng một ứng dụng đặt lịch (Booking App) mà phải giải quyết bài toán Tối ưu hóa Lập lịch Đa Mục tiêu (Multi-Objective Appointment Scheduling Problem - MOASP). Mục tiêu của giải pháp bao gồm:
Tối đa hóa Sự Hài lòng của Khách hàng (Maximize CSAT): Thông qua việc giảm thiểu thời gian chờ, đáp ứng tối đa sở thích về KTV và khung giờ.8
Tối ưu hóa Hiệu quả Vận hành: Đảm bảo tỷ lệ lấp đầy (Utilization Rate) của phòng và KTV ở mức cao nhất, giảm thiểu thời gian chết (idle time).6
Đảm bảo Tính Ổn định (Stability): Hệ thống phải có khả năng tự động điều chỉnh khi có sự cố (Rescheduling) với mức độ xáo trộn thấp nhất cho các lịch hẹn đã chốt.9
2. Cơ sở Lý thuyết và Tổng quan Tài liệu Nghiên cứu
Để giải quyết bài toán phức tạp này, cần kết hợp các lý thuyết từ Vận trù học (Operations Research) và Quản lý Dịch vụ (Service Management).
2.1 Bài toán Xếp lịch Dự án Có Ràng buộc Tài nguyên (RCPSP)
Về mặt toán học, hoạt động của Spa có thể được mô hình hóa như một biến thể của Bài toán Xếp lịch Dự án Có Ràng buộc Tài nguyên (Resource-Constrained Project Scheduling Problem - RCPSP). Trong bối cảnh này:
Hoạt động (Activities): Là các gói dịch vụ (massage, facial, xông hơi). Mỗi hoạt động có thời lượng (duration) và yêu cầu tài nguyên cụ thể.
Tài nguyên (Resources): Bao gồm KTV (nhân lực), Phòng điều trị (không gian), và Thiết bị chuyên dụng (máy móc).11
Tuy nhiên, mô hình RCPSP truyền thống thường giả định tài nguyên là tĩnh. Trong Spa, tài nguyên mang tính biến đổi theo thời gian (Time-Varying Resources): KTV làm việc theo ca (shifts), có giờ nghỉ, và năng lực làm việc có thể thay đổi (mệt mỏi cuối ngày).11 Hơn nữa, các bài toán hiện đại mở rộng sang khái niệm Đa kỹ năng (Multi-skill): Một KTV có thể thực hiện nhiều loại dịch vụ khác nhau nhưng với mức độ thành thạo khác nhau, điều này cần được đưa vào mô hình tối ưu hóa.12
2.2 Định lượng Sự Hài lòng và Các Hàm Mục tiêu
Trong các nghiên cứu về xếp lịch bệnh nhân (gần gũi với Spa), sự hài lòng thường được đo lường thông qua Thời gian Tiếp cận (Access Time) và Thời gian Chờ (Waiting Time). Các mô hình tối ưu hóa ngẫu nhiên (Stochastic Optimization) đã chứng minh rằng việc giảm thiểu thời gian tiếp cận có thể cải thiện hiệu suất hệ thống lên tới 56% so với các thực hành hiện tại.13
Một khái niệm quan trọng khác là Sự Công bằng (Fairness). Trong một hệ thống đặt lịch, công bằng nghĩa là không để một khách hàng nào phải chờ đợi quá lâu để nhường chỗ cho việc tối ưu hóa cục bộ của người khác. Chỉ số Công bằng Jain (Jain's Fairness Index) được sử dụng rộng rãi để đo lường sự phân bổ tài nguyên (ở đây là thời gian phục vụ đúng hạn) giữa các người dùng. Chỉ số này dao động từ 0 (bất công tuyệt đối) đến 1 (công bằng tuyệt đối), giúp hệ thống tránh việc hy sinh trải nghiệm của một nhóm khách hàng nhỏ để đạt chỉ số tổng thể cao.14
2.3 Chiến lược Lập lịch Phản ứng (Reactive Scheduling)
Lập lịch không phải là một hành động tĩnh một lần (Static), mà là một quá trình động. Khi có sự cố (disruption) như khách đến muộn hay thiết bị hỏng, hệ thống cần thực hiện Lập lịch lại (Rescheduling).
Có hai chiến lược chính được thảo luận trong văn liệu:
Right-Shift Rescheduling: Đẩy lùi toàn bộ các lịch hẹn phía sau sang một khoảng thời gian tương ứng với độ trễ. Phương pháp này đơn giản nhưng gây ra hiệu ứng domino tiêu cực lên sự hài lòng của tất cả khách hàng sau đó.17
Match-up / Minimal Perturbation: Cố gắng sắp xếp lại cục bộ (ví dụ: đổi phòng, đổi KTV tương đương) để hấp thụ sự chậm trễ và đưa lịch trình trở lại trạng thái ban đầu càng sớm càng tốt. Mục tiêu là giảm thiểu sự sai lệch (deviation) so với lịch trình gốc.9 Đây là phương pháp ưu việt hơn cho môi trường dịch vụ cao cấp như Spa.
3. Phân Tích Cấu trúc Bài toán và Mô hình Hóa Toán học
Phần này chuyển đổi các yêu cầu nghiệp vụ thành ngôn ngữ toán học, làm cơ sở cho thuật toán giải quyết.
3.1 Định nghĩa Các Tập hợp và Tham số
$T$: Tập hợp các khoảng thời gian (Time slots) trong ngày làm việc.
$S$: Tập hợp các nhân viên/KTV (Staff), mỗi nhân viên $s \in S$ có tập kỹ năng $K_s$.
$R$: Tập hợp các phòng (Rooms), mỗi phòng $r \in R$ có sức chứa và trang thiết bị cụ thể.
$C$: Tập hợp các yêu cầu đặt lịch (Customers bookings), mỗi yêu cầu $c \in C$ bao gồm dịch vụ $v_c$, thời lượng $d_c$, và sở thích $p_c$ (về thời gian và nhân viên).
3.2 Phân loại Ràng buộc (Constraints Classification)
Hệ thống phải xử lý hai loại ràng buộc song song: Ràng buộc Cứng (Hard Constraints) và Ràng buộc Mềm (Soft Constraints).
3.2.1 Ràng buộc Cứng (Hard Constraints - Bắt buộc thỏa mãn)
Vi phạm các ràng buộc này sẽ tạo ra một lịch trình không khả thi về mặt vật lý.
Ràng buộc Duy nhất: Một KTV hoặc một phòng không thể phục vụ hai khách hàng cùng một lúc.

$$\sum_{c \in C} x_{c, s, t} \leq 1, \quad \forall s \in S, t \in T$$
Ràng buộc Kỹ năng: Dịch vụ $v_c$ chỉ được gán cho nhân viên $s$ nếu $s$ có kỹ năng thực hiện $v_c$.12
Ràng buộc Tính liên tục (Non-preemption): Một khi dịch vụ bắt đầu, nó không được phép ngắt quãng (trừ khi có quy định nghỉ giữa hiệp).
Ràng buộc Về Sức chứa: Tổng số người trong Spa tại thời điểm $t$ không được vượt quá sức chứa tối đa của cơ sở vật chất.21
Thời gian Chuyển đổi (Transition/Setup Time): Giữa hai lịch hẹn liên tiếp của cùng một phòng/KTV, phải có khoảng thời gian $\Delta t$ để dọn dẹp và chuẩn bị.22
3.2.2 Ràng buộc Mềm (Soft Constraints - Tối ưu hóa)
Vi phạm các ràng buộc này không làm hỏng lịch trình nhưng làm giảm chất lượng dịch vụ. Chúng được đưa vào hàm mục tiêu dưới dạng các khoản phạt (penalties).24
Sở thích KTV: Khách hàng yêu cầu KTV A nhưng phải dùng KTV B.
Sở thích Thời gian: Khách muốn 10:00 AM nhưng chỉ xếp được 10:30 AM.
Sự phân mảnh lịch trình: Tránh tạo ra các khoảng trống nhỏ (ví dụ 15 phút) giữa các lịch hẹn mà không thể bán được cho khách khác.
3.3 Hàm Mục tiêu Đa Biến (Multi-Objective Function)
Để giải quyết yêu cầu "cân bằng giữa trải nghiệm và lợi ích", hàm mục tiêu $Z$ cần được thiết kế dưới dạng tổng trọng số của các thành phần chi phí.8
$$ \text{Minimize } Z = \alpha \cdot C_{wait} + \beta \cdot C_{pref} + \gamma \cdot C_{idle} + \delta \cdot C_{perturb} $$
Trong đó:
$C_{wait}$: Tổng thời gian chờ đợi dự kiến của khách hàng (liên quan đến CSAT).
$C_{pref}$: Chi phí phạt do không đáp ứng đúng sở thích (KTV, giờ) của khách (liên quan đến CSAT).
$C_{idle}$: Thời gian chết của nhân viên và phòng (ngược với Hiệu quả vận hành/Utilization).
$C_{perturb}$: Mức độ thay đổi lịch trình khi có sự cố (liên quan đến Ổn định vận hành).
$\alpha, \beta, \gamma, \delta$: Các trọng số (weights) thể hiện chiến lược kinh doanh của Spa (ví dụ: Spa cao cấp sẽ đặt $\alpha, \beta$ rất cao, trong khi Spa bình dân có thể ưu tiên giảm $\gamma$).13
3.4 Mô hình Hóa Sự Công bằng (Fairness Modeling)
Để tránh tình trạng "bỏ rơi" các ca khó xếp lịch, mô hình tích hợp ràng buộc về Chỉ số Công bằng Jain. Hệ thống sẽ cố gắng tối đa hóa chỉ số này đối với độ lệch thời gian (deviation) của các khách hàng.


$$J = \frac{(\sum_{i=1}^n x_i)^2}{n \cdot \sum_{i=1}^n x_i^2}$$

Với $x_i$ là mức độ thỏa mãn (hoặc nghịch đảo của thời gian chờ) của khách hàng $i$. Việc giữ $J$ gần 1 đảm bảo rằng không có khách hàng nào bị đối xử quá tệ so với mức trung bình.16
4. Đề xuất Giải pháp Lập lịch Thông minh
Giải pháp đề xuất không chỉ là một thuật toán mà là một hệ sinh thái phần mềm, tích hợp giữa giao diện người dùng (Mobile App) và bộ não xử lý trung tâm (Solver Engine).
4.1 Lựa chọn Công nghệ: Google OR-Tools CP-SAT
Thay vì sử dụng các thuật toán di truyền (Genetic Algorithm) phức tạp và khó kiểm soát, giải pháp sử dụng Google OR-Tools với bộ giải CP-SAT (Constraint Programming - Satisfiability
