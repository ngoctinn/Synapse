"""
TreatmentNote Model - Appended to bookings/models.py
"""


class TreatmentNote(SQLModel, table=True):
    """
    Ghi chú chuyên môn sau buổi hẹn.

    KTV ghi lại tình trạng da/tóc, phản ứng của khách sau dịch vụ
    để phục vụ tốt hơn cho các lần tiếp theo.
    """
    __tablename__ = "treatment_notes"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    booking_id: uuid.UUID = Field(
        foreign_key="bookings.id",
        ondelete="CASCADE"
    )
    staff_id: uuid.UUID = Field(
        foreign_key="users.id",
        ondelete="CASCADE"
    )

    content: str = Field(max_length=1000)
    note_type: NoteType = Field(
        default=NoteType.PROFESSIONAL,
        sa_type=SAEnum(NoteType, name="note_type")
    )

    created_at: datetime = Field(
        sa_type=DateTime(timezone=True),
        default_factory=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    booking: "Booking" = Relationship(back_populates="notes")
    staff: "User" = Relationship()
