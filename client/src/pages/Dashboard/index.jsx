import { useState } from 'react';
import { Image as ImageIcon, KeyRound, Tv } from 'lucide-react';
import { useToast } from '../../components/CustomToast';
import { ConfirmModal } from '../../components/CustomModal';
import useAdminSession from './hooks/useAdminSession';
import useDeviceSocket from './hooks/useDeviceSocket';
import useDevices from './hooks/useDevices';
import useContents from './hooks/useContents';
import usePushContent from './hooks/usePushContent';
import usePlaylist from './hooks/usePlaylist';
import usePairing from './hooks/usePairing';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import StatusCards from './components/StatusCards';
import DevicesSection from './components/DevicesSection';
import ContentsSection from './components/ContentsSection';
import PairingSection from './components/PairingSection';
import AddDeviceModal from './components/modals/AddDeviceModal';
import EditDeviceModal from './components/modals/EditDeviceModal';
import AddContentModal from './components/modals/AddContentModal';
import EditContentModal from './components/modals/EditContentModal';
import PushContentModal from './components/modals/PushContentModal';
import PlaylistModal from './components/modals/PlaylistModal';
import ApprovePairingModal from './components/modals/ApprovePairingModal';

const navItems = [
  { key: 'devices', label: 'Devices', icon: Tv },
  { key: 'contents', label: 'Konten', icon: ImageIcon },
  { key: 'pairing', label: 'Pairing', icon: KeyRound },
];

export default function Dashboard() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('devices');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmState, setConfirmState] = useState({ open: false, onConfirm: () => {}, message: '' });
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  const { admin, doLogout } = useAdminSession();

  const {
    devices,
    setDevices,
    fetchDevices,
    deviceSearch,
    setDeviceSearch,
    filteredDevices,
    onlineCount,
    offlineCount,
    deviceModalOpen,
    setDeviceModalOpen,
    newDevice,
    setNewDevice,
    handleAddDevice,
    editDeviceModalOpen,
    setEditDeviceModalOpen,
    editDevice,
    setEditDevice,
    openEditDevice,
    handleEditDevice,
    askDeleteDevice,
    copyDeviceLink,
  } = useDevices({ toast, setConfirmState, submitting, setSubmitting });

  const {
    pairings,
    setPairings,
    approveModalOpen,
    setApproveModalOpen,
    approveTarget,
    approveForm,
    setApproveForm,
    unpairedDevices,
    openApproveModal,
    handleApprovePairing,
    rejectPairing,
  } = usePairing({ toast, setSubmitting, fetchDevices, devices });

  useDeviceSocket(setDevices, setPairings);

  const {
    contents,
    contentSearch,
    setContentSearch,
    filteredContents,
    contentModalOpen,
    setContentModalOpen,
    closeAddContentModal,
    newContent,
    setNewContent,
    showAddPreview,
    setShowAddPreview,
    handleAddContent,
    editContentModalOpen,
    setEditContentModalOpen,
    editContent,
    setEditContent,
    openEditContent,
    handleEditContent,
    askDeleteContent,
  } = useContents({ toast, setConfirmState, submitting, setSubmitting, fetchDevices });

  const {
    pushModalOpen,
    setPushModalOpen,
    pushTarget,
    setPushTarget,
    openPushModal,
    handlePushContent,
  } = usePushContent({ toast, submitting, setSubmitting, fetchDevices });

  const {
    playlistModalOpen,
    setPlaylistModalOpen,
    playlistDevice,
    playlistItems,
    setPlaylistItems,
    playlistLoading,
    newPlaylistItem,
    setNewPlaylistItem,
    openPlaylistModal,
    handleAddPlaylistItem,
    handleRemovePlaylistItem,
    handleUpdatePlaylistDuration,
    handleMovePlaylistItem,
    handleActivatePlaylist,
    handleDeactivatePlaylist,
  } = usePlaylist({ toast, submitting, setSubmitting, fetchDevices });

  return (
    <div className="min-h-screen bg-bgmint dark:bg-slate-900 flex transition-colors">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        navItems={navItems}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        admin={admin}
        onLogoutRequest={() => setLogoutConfirmOpen(true)}
      />

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <main className="flex-1 min-w-0">
        <Topbar setSidebarOpen={setSidebarOpen} onPushClick={() => openPushModal(null)} />

        <div className="p-4 sm:p-8">
          <StatusCards total={devices.length} onlineCount={onlineCount} offlineCount={offlineCount} />

          {activeTab === 'devices' && (
            <DevicesSection
              devices={devices}
              filteredDevices={filteredDevices}
              deviceSearch={deviceSearch}
              setDeviceSearch={setDeviceSearch}
              onAddClick={() => setDeviceModalOpen(true)}
              onCopyLink={copyDeviceLink}
              onEditClick={openEditDevice}
              onPlaylistClick={openPlaylistModal}
              onPushClick={openPushModal}
              onDeleteClick={askDeleteDevice}
            />
          )}

          {activeTab === 'contents' && (
            <ContentsSection
              contents={contents}
              filteredContents={filteredContents}
              contentSearch={contentSearch}
              setContentSearch={setContentSearch}
              onAddClick={() => setContentModalOpen(true)}
              onEditClick={openEditContent}
              onDeleteClick={askDeleteContent}
            />
          )}

          {activeTab === 'pairing' && (
            <PairingSection pairings={pairings} onApprove={openApproveModal} onReject={rejectPairing} />
          )}
        </div>
      </main>

      <AddDeviceModal
        open={deviceModalOpen}
        onClose={() => setDeviceModalOpen(false)}
        newDevice={newDevice}
        setNewDevice={setNewDevice}
        onSubmit={handleAddDevice}
        submitting={submitting}
      />

      <EditDeviceModal
        open={editDeviceModalOpen}
        onClose={() => setEditDeviceModalOpen(false)}
        editDevice={editDevice}
        setEditDevice={setEditDevice}
        onSubmit={handleEditDevice}
        submitting={submitting}
      />

      <AddContentModal
        open={contentModalOpen}
        onClose={closeAddContentModal}
        newContent={newContent}
        setNewContent={setNewContent}
        showAddPreview={showAddPreview}
        setShowAddPreview={setShowAddPreview}
        onSubmit={handleAddContent}
        submitting={submitting}
      />

      <EditContentModal
        open={editContentModalOpen}
        onClose={() => setEditContentModalOpen(false)}
        editContent={editContent}
        setEditContent={setEditContent}
        onSubmit={handleEditContent}
        submitting={submitting}
      />

      <PushContentModal
        open={pushModalOpen}
        onClose={() => setPushModalOpen(false)}
        devices={devices}
        contents={contents}
        pushTarget={pushTarget}
        setPushTarget={setPushTarget}
        onSubmit={handlePushContent}
        submitting={submitting}
      />

      <PlaylistModal
        open={playlistModalOpen}
        onClose={() => setPlaylistModalOpen(false)}
        playlistDevice={playlistDevice}
        playlistItems={playlistItems}
        setPlaylistItems={setPlaylistItems}
        playlistLoading={playlistLoading}
        newPlaylistItem={newPlaylistItem}
        setNewPlaylistItem={setNewPlaylistItem}
        contents={contents}
        submitting={submitting}
        onAddItem={handleAddPlaylistItem}
        onRemoveItem={handleRemovePlaylistItem}
        onUpdateDuration={handleUpdatePlaylistDuration}
        onMoveItem={handleMovePlaylistItem}
        onActivate={handleActivatePlaylist}
        onDeactivate={handleDeactivatePlaylist}
      />

      <ApprovePairingModal
        open={approveModalOpen}
        onClose={() => setApproveModalOpen(false)}
        approveTarget={approveTarget}
        approveForm={approveForm}
        setApproveForm={setApproveForm}
        unpairedDevices={unpairedDevices}
        onSubmit={handleApprovePairing}
        submitting={submitting}
      />

      <ConfirmModal
        open={confirmState.open}
        onClose={() => setConfirmState({ ...confirmState, open: false })}
        onConfirm={confirmState.onConfirm}
        title="Konfirmasi Hapus"
        message={confirmState.message}
        confirmLabel="Ya, Hapus"
        danger
      />

      <ConfirmModal
        open={logoutConfirmOpen}
        onClose={() => setLogoutConfirmOpen(false)}
        onConfirm={doLogout}
        title="Konfirmasi Keluar"
        message="Apakah Anda yakin ingin keluar dari Dashboard Admin?"
        confirmLabel="Ya, Keluar"
        cancelLabel="Batal"
        danger
      />
    </div>
  );
}
