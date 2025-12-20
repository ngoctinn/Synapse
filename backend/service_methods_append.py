
    # =========================================================================
    # TREATMENT NOTES
    # =========================================================================

    async def add_note(
        self,
        booking_id: uuid.UUID,
        staff_id: uuid.UUID,
        content: str,
        note_type: str = "PROFESSIONAL"
    ):
        """
        Thêm ghi chú chuyên môn cho booking.

        Args:
            booking_id: ID của booking
            staff_id: ID của staff (từ auth context)
            content: Nội dung ghi chú
            note_type: Loại ghi chú (PROFESSIONAL/GENERAL)
        """
        from .models import TreatmentNote, NoteType
        from src.modules.users.models import User
        from .schemas import TreatmentNoteRead

        # Verify booking exists
        booking = await self.get_by_id(booking_id)
        if not booking:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Không tìm thấy booking"
            )

        # Create note
        note = TreatmentNote(
            booking_id=booking_id,
            staff_id=staff_id,
            content=content,
            note_type=NoteType[note_type]
        )

        self.session.add(note)
        await self.session.commit()
        await self.session.refresh(note)

        # Get staff name
        staff_query = select(User).where(User.id == staff_id)
        staff_result = await self.session.exec(staff_query)
        staff = staff_result.first()

        # Build response
        return TreatmentNoteRead(
            id=note.id,
            booking_id=note.booking_id,
            staff_id=note.staff_id,
            content=note.content,
            note_type=note.note_type.value,
            created_at=note.created_at,
            staff_name=staff.full_name if staff else None
        )

    async def get_notes(self, booking_id: uuid.UUID):
        """Lấy danh sách ghi chú của booking."""
        from .models import TreatmentNote
        from src.modules.users.models import User
        from .schemas import TreatmentNoteRead

        query = select(TreatmentNote).where(
            TreatmentNote.booking_id == booking_id
        ).order_by(TreatmentNote.created_at.desc())

        result = await self.session.exec(query)
        notes = result.all()

        # Get staff names
        note_reads = []
        for note in notes:
            staff_query = select(User).where(User.id == note.staff_id)
            staff_result = await self.session.exec(staff_query)
            staff = staff_result.first()

            note_reads.append(TreatmentNoteRead(
                id=note.id,
                booking_id=note.booking_id,
                staff_id=note.staff_id,
                content=note.content,
                note_type=note.note_type.value,
                created_at=note.created_at,
                staff_name=staff.full_name if staff else None
            ))

        return note_reads
